#!/usr/bin/env node

/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import path from "path";
import process from "process";

import { readFileSync, writeFileSync } from "fs";
import { CharStreams, CommonTokenStream } from "antlr4ng";
import { glob } from "glob";
import { OptionValues, program } from "commander";

import { GrammarFormatter, IFormattingOptions } from "./GrammarFormatter.js";
import { ANTLRv4Lexer } from "./parser/ANTLRv4Lexer.js";

interface IAppParameters extends OptionValues {
    source: string;
}

/**
 * Runs the grammar formatter on the given grammar file.
 * Start and stop positions are useful to format only a part of the grammar. When given the formatter returns
 * the formatted part and the new start and stop positions, which can be used to replace the original text.
 *
 * @param grammarPath The path to the grammar file.
 * @param options Options to use for formatting.
 * @param start The character index in the file where formatting should start.
 * @param stop The character index in the file where formatting should stop.
 *
 * @returns The formatted grammar and the computed start and stop indices.
 */
const formatGrammar = (grammarPath: string, options: IFormattingOptions, start: number,
    stop: number): [string, number, number] => {
    const grammar = readFileSync(grammarPath, { encoding: "utf8" });
    const lexer = new ANTLRv4Lexer(CharStreams.fromString(grammar));

    lexer.removeErrorListeners();
    const tokenStream = new CommonTokenStream(lexer);

    lexer.reset();
    tokenStream.setTokenSource(lexer);

    tokenStream.fill();
    const tokens = tokenStream.getTokens();
    const formatter = new GrammarFormatter(tokens);

    return formatter.formatGrammar(options, start, stop);
};

program
    .requiredOption("-s, --source <path|pattern>", "The path to a grammar file or a glob pattern for multiple files.")
    .option("-t, -target <path>", "The path to the target file.")
    ;

program.parse();

const options = program.opts<IAppParameters>();

const pattern = options.source.endsWith(".g4") ? options.source : options.source + "/**/*.g4";
const fileList = glob.sync(pattern, { nodir: true });
if (fileList.length === 0) {
    console.error("The specified pattern/path did not return any file.\n");

    process.exit(0);
}

const defaultOptions: IFormattingOptions = {
    reflowComments: false,
};

console.log("Formatting " + fileList.length + " files:");
fileList.forEach((grammarPath) => {
    console.log("  " + grammarPath);
    const [text] = formatGrammar(grammarPath, defaultOptions, 0, 1e10);

    //const formattedGrammarPath = path.join(args[1], path.basename(grammarPath));
    const formattedGrammarPath = grammarPath;
    writeFileSync(formattedGrammarPath, text);
});

console.log("\nDone.\n");
