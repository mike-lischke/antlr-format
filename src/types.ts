/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

/**
 * Options for grammar text formatting. Some names, values and meanings have been taken from clang-format
 * (http://clang.llvm.org/docs/ClangFormatStyleOptions.html), but may have slight variations tailored towards
 * ANTLR grammars. Deviations from that are mentioned in comments, otherwise see clang-format and the documentation for
 * descriptions + examples.
 */
export interface IFormattingOptions {
    /** Default: false */
    disabled?: boolean;

    /** Default: false */
    alignTrailingComments?: boolean;

    /** Default: true; */
    allowShortBlocksOnASingleLine?: boolean;

    /** When true start predicates and actions on a new line. Default: false. */
    breakBeforeBraces?: boolean;

    /** Default: 100 chars. */
    columnLimit?: number;

    /** For line continuation (only used if useTab is false). Default: same as indentWith. */
    continuationIndentWidth?: number;

    /** Default: 4 chars. */
    indentWidth?: number;

    /** Default: false. */
    keepEmptyLinesAtTheStartOfBlocks?: boolean;

    /** Default: 1. */
    maxEmptyLinesToKeep?: number;

    /** Default: false. */
    reflowComments?: boolean;

    /** Default: true */
    spaceBeforeAssignmentOperators?: boolean;

    /** Default: 4. */
    tabWidth?: number;

    /** Default: true. */
    useTab?: boolean;

    /**
     * Values not found in clang-format:
     * When set to "none" places the colon directly behind the rule name. Trailing alignment aligns colons of
     * consecutive single line rules (with at least one whitespace between rule name and colon). Hanging alignment
     * moves the colon to the next line (after the normal indentation, aligning it so with the alt pipe chars).
     * Default: none.
     */
    alignColons?: "none" | "trailing" | "hanging";

    /**
     * When `allowShortRulesOnASingleLine` is true and `alignColon` is set to "hanging" this setting determines which
     * gets precedence. If true (the default) a rule is placed on a single line if it fits, ignoring the "hanging"
     * setting.
     */
    singleLineOverrulesHangingColon?: boolean;

    /** Like allowShortBlocksOnASingleLine, but for entire rules. Default: true. */
    allowShortRulesOnASingleLine?: boolean;

    /**
     * Place semicolon behind last code token or on an own line (with or w/o indentation). Default: ownLine
     * (no indentation). This setting has no effect for non-rule commands that end with a semicolon
     * (e.g. "grammar Test;", "import Blah;" etc.). Such commands are always placed on a single line.
     */
    alignSemicolons?: "none" | "ownLine" | "hanging";

    /** For blocks: if true puts opening parentheses on an own line. Default: false. */
    breakBeforeParens?: boolean;

    /**
     * Place rule internals (return value, local variables, @init, @after) all on a single line, if true.
     * Default: false.
     */
    ruleInternalsOnSingleLine?: boolean;

    /** Between top level elements, how many empty lines must exist? Default: 0. */
    minEmptyLines?: number;

    /**
     * When true alignments are organized in groups of lines where they apply. These line groups are separated
     * by lines where a specific alignment type does not appear. Default: true.
     */
    groupedAlignments?: boolean;

    /** Align first tokens in rules after the colon. Default: false. */
    alignFirstTokens?: boolean;

    /** Align arrows from lexer commands. Default: false. */
    alignLexerCommands?: boolean;

    /** Align actions ({} blocks in rules) and predicates. Default: false. */
    alignActions?: boolean;

    /** Align alt labels (# name). Default: true. */
    alignLabels?: boolean;

    /**
     * When true a single alignment for labels, actions, lexer commands and trailing comments is used instead of
     * individual alignments for each type. This avoids large whitespace runs if you have a mix of these types.
     * Setting alignTrailers disables the individual alignment settings of the mentioned types.
     */
    alignTrailers?: boolean;
}

/** Structure of a configuration JSON file. */
export interface IConfiguration {
    /**
     * Main options, used for parser and combined grammars. Also for lexer grammars, if the lexer key is not specified.
     *
     */
    main: IFormattingOptions;

    /** Dedicated options only for lexer grammars. */
    lexer?: IFormattingOptions;
};
