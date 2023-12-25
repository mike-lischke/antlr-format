/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import * as fs from "fs";

import { CharStreams, CommonTokenStream } from "antlr4ng";

import { positionToIndex, indexToPosition } from "./test-helpers.js";
import { GrammarFormatter } from "../src/GrammarFormatter.js";
import { ANTLRv4Lexer } from "../src/parser/ANTLRv4Lexer.js";
import { IConfiguration, IFormattingOptions } from "../src/types.js";

interface ITestRange {
    source: {
        start: {
            column: number;
            row: number;
        };
        end: {
            column: number;
            row: number;
        };
    };
    target: {
        start: {
            column: number;
            row: number;
        };
        end: {
            column: number;
            row: number;
        };
    };
    result: string;
}

const formatGrammar = (grammar: string, options: IFormattingOptions, start: number,
    stop: number): [string, number, number] => {
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

const formatGrammarFromPath = (grammarPath: string, options: IFormattingOptions, start: number,
    stop: number): [string, number, number] => {
    const grammar = fs.readFileSync(grammarPath, { encoding: "utf8" });

    return formatGrammar(grammar, options, start, stop);
};

describe("Formatting", () => {
    it("With all options (except alignment)", () => {
        // Format a file with all kinds of syntactic elements. Start out with default
        // formatting options and change them in the file to test all variations.
        const [text] = formatGrammarFromPath("tests/formatting/raw.g4", { reflowComments: true }, 0, 1e10);

        //fs.writeFileSync("tests/formatting-results/raw2.g4", text, "utf8");
        const expected = fs.readFileSync("tests/formatting-results/raw.g4", { encoding: "utf8" });
        expect(expected).toEqual(text);
    });

    it("Alignment formatting", () => {
        //createAlignmentGrammar();

        // Load a large file with all possible alignment combinations (50 rules for each permutation),
        // checking so also the overall performance (9600 rules).
        const [text] = formatGrammarFromPath("tests/formatting/alignment.g4", { reflowComments: true }, 0, 1e10);

        //fs.writeFileSync("tests/formatting-results/alignment.g4", text, "utf8");
        const expected = fs.readFileSync("tests/formatting-results/alignment.g4", { encoding: "utf8" });
        expect(expected).toEqual(text);
    });

    it("Ranged formatting", () => {
        let [text, targetStart, targetStop] = formatGrammarFromPath("tests/formatting/raw.g4", { reflowComments: true },
            -10, -20);
        expect(text).toHaveLength(0);
        expect(targetStart).toEqual(0);
        expect(targetStop).toEqual(4);

        const rangeTests = JSON.parse(fs.readFileSync("tests/formatting/ranges.json",
            { encoding: "utf8" })) as ITestRange[];
        const source = fs.readFileSync("tests/formatting/raw.g4", { encoding: "utf8" });

        for (const rangeTest of rangeTests) {
            // Range ends are non-inclusive.
            const startIndex = positionToIndex(source, rangeTest.source.start.column, rangeTest.source.start.row);
            const stopIndex = positionToIndex(source, rangeTest.source.end.column, rangeTest.source.end.row) - 1;
            [text, targetStart, targetStop] = formatGrammarFromPath("tests/formatting/raw.g4", { reflowComments: true },
                startIndex, stopIndex);

            const [startColumn, startRow] = indexToPosition(source, targetStart);
            const [stopColumn, stopRow] = indexToPosition(source, targetStop + 1);
            const range = {
                start: { column: startColumn, row: startRow }, end: { column: stopColumn, row: stopRow },
            };

            //fs.writeFileSync("tests/formatting-results/res-" + rangeTest.result, text, "utf8");
            const expected = fs.readFileSync("tests/formatting-results/" + rangeTest.result, { encoding: "utf8" });
            expect(range).toStrictEqual(rangeTest.target);
            expect(expected).toEqual(text);
        }
    });

    it("Bug antlr/grammars-v4#3862", () => {
        const [text] = formatGrammarFromPath("tests/formatting/bug3862.g4", {}, 0, 1e10);
        //fs.writeFileSync("tests/formatting-results/bug3862.g4", text, "utf8");
        const expected = fs.readFileSync("tests/formatting-results/bug3862.g4", { encoding: "utf8" });
        expect(expected).toEqual(text);
    });

    it("Colons in blocks", () => {
        const [text] = formatGrammarFromPath("tests/formatting/Colons.g4", {}, 0, 1e10);
        //fs.writeFileSync("tests/formatting-results/colons.g4", text, "utf8");
        const expected = fs.readFileSync("tests/formatting-results/colons.g4", { encoding: "utf8" });
        expect(expected).toEqual(text);
    });

    it("Rule options", () => {
        const [text] = formatGrammarFromPath("tests/formatting/RuleOptions.g4", {}, 0, 1e10);
        fs.writeFileSync("tests/formatting-results/RuleOptions.g4", text, "utf8");
        const expected = fs.readFileSync("tests/formatting-results/RuleOptions.g4", { encoding: "utf8" });
        expect(expected).toEqual(text);
    });

    it("Bug #2", () => {
        // A bug which describes that a repeated formatting of the same file leads to a different result.
        const configText = fs.readFileSync("tests/formatting/bug#2-config.json", { encoding: "utf8" });
        const config = JSON.parse(configText) as IConfiguration;

        const [first] = formatGrammarFromPath("tests/formatting/PlSqlLexer.g4.txt", config.lexer!, 0, 1e10);
        //fs.writeFileSync("tests/formatting-results/bug#2-1.g4", first, "utf8");

        const [second] = formatGrammar(first, config.lexer!, 0, 1e10);
        //fs.writeFileSync("tests/formatting-results/bug#2-2.g4", second, "utf8");
        expect(first).toEqual(second);

        const [third] = formatGrammar(second, config.lexer!, 0, 1e10);
        expect(second).toEqual(third);

        const [fourth] = formatGrammar(third, config.lexer!, 0, 1e10);
        expect(third).toEqual(third);

        const [fifth] = formatGrammar(fourth, config.lexer!, 0, 1e10);
        expect(fifth).toEqual(fourth);
    });
});
