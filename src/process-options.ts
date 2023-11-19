/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

// @ts-expect-error, as the import assertion conflicts between Node and TS.
import configSchema from "./config-schema.json" assert { type: "json" };

// eslint-disable-next-line @typescript-eslint/naming-convention
import Ajv, { ErrorObject } from "ajv";
import betterAjvErrors from "@readme/better-ajv-errors";

import { existsSync, readFileSync } from "fs";

import { IConfiguration, IFormattingOptions } from "./types.js";

export interface IConfigurationDetails {
    main: IFormattingOptions;
    mainText: string;
    lexer: IFormattingOptions;
    lexerText: string;
};

const convertToComment = (options: IFormattingOptions): string => {
    const entries: string[] = [];
    for (const [key, value] of Object.entries(options)) {
        entries.push(`${key} ${value}`);
    }

    let line = "";
    const lines: string[] = [];
    while (true) {
        const next = entries.shift();
        if (!next) {
            break;
        }

        if (line.length + next.length > 130) {
            lines.push("// $antlr-format " + line);
            line = "";
        }

        line += (line.length > 0 ? ", " : "") + next;
    }

    return lines.join("\n");
};

/**
 * Processes the options specified by the user and adds inline options in the grammar file (if enabled).
 *
 * @param configPath The path to the configuration file.
 *
 * @returns A tuple with the main and lexer options, formatted as single line comments, ready to be inserted
 *          into grammars.
 */
export const processFormattingOptions = (configPath?: string): IConfigurationDetails => {
    let mainOptions: IFormattingOptions = {};
    let lexerOptions: IFormattingOptions = {};

    if (configPath && existsSync(configPath)) {
        const content = readFileSync(configPath, { encoding: "utf-8" });
        const config = JSON.parse(content) as IConfiguration;

        // Validate the configuration file using our schema.
        const ajv = new Ajv.default({ allErrors: true, verbose: true });
        const validate = ajv.compile(configSchema);
        const valid = validate(config);
        if (!valid) {
            console.log(`\nFound config validation errors in ${configPath}\n`);

            // @ts-expect-error, because the type definition export is wrong.
            const error = betterAjvErrors(configSchema, config, validate.errors as ErrorObject[], {
                json: content,
            });
            console.log(error + "\n");

            process.exit(1);
        }

        mainOptions = config.main;
        lexerOptions = config.lexer ?? mainOptions;

        return {
            main: mainOptions,
            mainText: convertToComment(mainOptions),
            lexer: lexerOptions,
            lexerText: convertToComment(lexerOptions),
        };
    }

    return { main: {}, mainText: "", lexer: {}, lexerText: "" };
};
