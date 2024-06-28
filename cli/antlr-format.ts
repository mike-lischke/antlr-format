#!/usr/bin/env node

/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { existsSync, readFileSync, writeFileSync } from "fs";
import { glob } from "glob";
import process from "process";
import path from "path";

import { OptionValues, program } from "commander";

import { CharStream, CommonTokenStream } from "antlr4ng";

import { ANTLRv4Lexer } from "../src/parser/ANTLRv4Lexer.js";
import { IConfigurationDetails, processFormattingOptions } from "./process-options.js";

import { GrammarFormatter } from "../src/GrammarFormatter.js";
import { IFormattingOptions } from "../src/types.js";

interface IAppParameters extends OptionValues {
    /** The path to a single source file or a glob pattern for multiple files. */
    pattern: string;

    /** When true, add the default ANTLR formatting option string to the grammar, before formatting it. */
    addOptions?: boolean;

    /**
     * Path to a JSON file with user-defined formatting options. If a grammar already contains formatting options,
     * they override the options from this file. If the grammar contains no options, the options from this file are
     * added to the grammar if the addOptions option is true.
     */
    config?: string;

    /** Suppress all output except errors. */
    silent?: boolean;

    /** Print additional information. */
    verbose?: boolean;
}

const matchBoolean = (value: string): boolean => {
    if (value == null) {
        return false;
    }

    const lower = value.trim().toLowerCase();

    return lower === "true" || lower === "1" || lower === "on" || lower === "yes";
};

let packageJson: { version: string; };

try {
    // Read the package.json file to get the version number. This file is located in the parent directory, when bundled
    // and in the same folder if not.
    const scriptPath = import.meta.url ? import.meta.url.substring(7) : __filename;
    let packagePath = path.join(path.dirname(scriptPath), "package.json");
    if (!existsSync(packagePath)) {
        packagePath = path.join(path.dirname(scriptPath), "../package.json");
    }

    packageJson = JSON.parse(readFileSync(packagePath, { encoding: "utf8" }));
} catch (error) {
    console.error("Error reading package.json file: " + error.message);
    process.exit(1);
}

const start = performance.now();

program
    .argument("file1, pattern2, ...", "A list of files or glob patterns for multiple files.")
    .option<boolean>("-a, --add-options [boolean]", "Insert the used ANTLR grammar formatting " +
        "options to the grammar file, if it contains no options.", matchBoolean, true)
    .option("-c, --config <path>", "Path to a JSON file containing the formatting options to use.")
    .option("-s, --silent", "Suppress all output except errors.")
    .option("-v, --verbose", "Print additional information.")
    .version(`antlr-format ${packageJson.version}`)
    .parse();

const options = program.opts<IAppParameters>();

const fileList = glob.sync(program.args, { nodir: true });
if (fileList.length === 0) {
    console.error(`No grammar file found using this pattern: ${program.args.join(", ")}.\n`);
    process.exit(0);  // No error, just no files to process.
}
fileList.sort();

const defaultOptions: IFormattingOptions = {
    reflowComments: false,
};

/**
 * Runs the grammar formatter on the given grammar file.
 * Start and stop positions are useful to format only a part of the grammar. When given the formatter returns
 * the formatted part and the new start and stop positions, which can be used to replace the original text.
 *
 * @param grammarPath The path to the grammar file.
 * @param config Options to use for formatting, both as object and string (for insertion).
 * @param start The character index in the file where formatting should start.
 * @param stop The character index in the file where formatting should stop.
 * @param addOptions If true, the default ANTLR grammar formatting options are added to the grammar file, if it
 *                   contains no options yet.
 *
 * @returns The formatted grammar and the computed start and stop indices.
 */
const formatGrammar = (grammarPath: string, config: IConfigurationDetails, start: number,
    stop: number, addOptions = true): [string, boolean] => {
    const grammar = readFileSync(grammarPath, { encoding: "utf8" });

    const lexer = new ANTLRv4Lexer(CharStream.fromString(grammar));

    lexer.removeErrorListeners();
    const tokenStream = new CommonTokenStream(lexer);
    tokenStream.fill();
    const tokens = tokenStream.getTokens();

    // Check the first default channel token for the grammar type.
    let options: IFormattingOptions = defaultOptions;
    for (const token of tokens) {
        if (token.channel === 0) {
            const type = token.text;
            if (type === "lexer") {
                options = config.lexer;
            } else {
                options = config.main;
            }

            break;
        }
    }

    const formatter = new GrammarFormatter(tokens, addOptions);
    const result = formatter.formatGrammar(options, start, stop);
    const changed = result[0] !== grammar;
    return [result[0], changed];
};

if (!options.silent) {
    console.log("\nantlr-format, processing options...");
}

const details = processFormattingOptions(options.config);

if (!options.silent) {
    console.log("\nformatting " + fileList.length + " file(s)...");
}

fileList.forEach((grammarPath) => {
    const [text, changed] = formatGrammar(grammarPath, details, 0, 1e10, options.addOptions);

    if (changed) {
        if (options.verbose) {
            console.log("  formatted: " + grammarPath);
        }
        writeFileSync(grammarPath, text);
    } else {
        if (options.verbose) {
            console.log("  unchanged: " + grammarPath);
        }
    }
});

if (!options.silent) {
    console.log(`\ndone [${Math.round((performance.now() - start))} ms]\n`);
}
