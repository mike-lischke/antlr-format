# Grammar Formatting

The `antlr-format` tool is able to format ANTLR4 grammar source code, considering a [large set of options](#available-formatting-options). The [clang-format](http://clang.llvm.org/docs/ClangFormatStyleOptions.html) tool acted as a model for option naming and some settings that have been taken over. Besides the usual things like block formatting, empty lines and comment formatting, there's a powerful alignment implementation. It allows to align certain grammar elements (trailing comments, lexer commands, alt labels, predicates and others) between consecutive lines that contain this grammar element (when grouped alignment is on) or for the entire file. There can even be multiple alignments on a line:

>![screen shot 1](https://raw.githubusercontent.com/mike-lischke/antlr-format/master/images/multiple-alignments.png)

The formatting feature can be controlled dynamically by special comments in the grammar source, which allow to switch a setting on the fly. You can even completely switch off formatting for a file or a part of it. Below are some examples for such formatting comments. You can use boolean values (on, off, true, false), numbers and identifiers (for word options). They are not case-sensitive.

```antlr
// $antlr-format on
// $antlr-format false
// $antlr-format columnLimit 150
// $antlr-format allowShortBlocksOnASingleLine true, indentWidth 8
```

Don't put anything else in a comment with formatting settings or parsing them will fail. All comment types are allowed, but single line comments are read line by line and hence require each line to start with the `$antlr-format` introducer.

Block and doc comments can be used like this:

```antlr
/**
 * $antlr-format
 * columnLimit 150, indentWidth 8
 * allowShortBlocksOnASingleLine true
 */
```

In order to set all settings to their default values use: `// $antlr-format reset`. This can also be used in conjunction with other options.

## Configuration

In addition to inline formatting options use a config file (for the terminal application) or an object with key-value pairs, when creating the `GrammarFormatter` class. A configuration file contains one mandatory and one optional set of options. The one in the `main` key is used for all types of grammars. Additionally, you can specify a dedicated lexer grammar option set, for cases where you want to have different rules for lexer grammars.

Here's the [config file](tests/config.json) used for tests in this repository.

```json
{
    "main": {
        "alignTrailingComments": true,
        "columnLimit": 150,
        "minEmptyLines": 1,
        "maxEmptyLinesToKeep": 1,
        "reflowComments": false,
        "useTab": false,
        "allowShortRulesOnASingleLine": false,
        "allowShortBlocksOnASingleLine": true,
        "alignSemicolons": "hanging",
        "alignColons": "hanging"
    },
    "lexer": {
        "alignTrailingComments": true,
        "columnLimit": 150,
        "maxEmptyLinesToKeep": 1,
        "reflowComments": false,
        "useTab": false,
        "allowShortRulesOnASingleLine": true,
        "allowShortBlocksOnASingleLine": true,
        "minEmptyLines": 0,
        "alignSemicolons": "ownLine",
        "alignColons": "trailing",
        "singleLineOverrulesHangingColon": true,
        "alignLexerCommands": true,
        "alignLabels": true,
        "alignTrailers": true
    }
}
```

For running the formatter in code use:

```typescript
    import * as fs from "fs";
    import { IFormattingOptions, GrammarFormatter } from "antlr-format";

    let options: IFormattingOptions = {
        "alignLexerCommands": true,
        "alignLabels": true,
        "alignTrailers": true,
        ...
    }

    const grammar = fs.readFileSync("<path to grammar file>");
    const formatter = new GrammarFormatter(grammar);

    const result = formatter.formatGrammar(options);

```

The formatter not only formats entire files, but can also apply your rules only to a part of a grammar, taking care to start and stop on valid positions. For this give the `formatGrammar` method start and end positions. The return result not only includes the formatted text but also start and stop indices you can use to update the original text.

## Available Formatting Options

* **disabled**: boolean (default: false), if true disables formatting
* **alignTrailingComments**: boolean (default: false), if true, aligns trailing comments
* **allowShortBlocksOnASingleLine**: boolean (default: true), allows contracting short blocks to a single line
* **breakBeforeBraces**: boolean (default: false), when true start predicates and actions on a new line
* **columnLimit**: number (default: 100), the character count after which automatic line breaking takes place
* **continuationIndentWidth**: number (default: 4), indentation for line continuation (only used if useTab is false)
* **indentWidth**: number (default: 4), character count for indentation (if useTab is false)
* **keepEmptyLinesAtTheStartOfBlocks**: boolean (default: false), if true, empty lines at the start of blocks are kept
* **maxEmptyLinesToKeep**: number (default: 1), the maximum number of consecutive empty lines to keep
* **reflowComments**: boolean (default: false), reformat comments to fit the column limit
* **spaceBeforeAssignmentOperators**: boolean (default: true), enables spaces around operators
* **tabWidth**: number (default: 4), multiples of this value determine tab stops in a document
* **useTab**: boolean (default: true), use tabs for indentation (otherwise spaces)
* **alignColons**: string enum (default: "none"), align colons among rules (scope depends on groupedAlignments)
    * **none**: place the colon directly after the rule name
    * **trailing**: align colons in the alignment group, directly after rule names
    * **hanging**: align the colon on the next line (with the pipe chars)
* **singleLineOverrulesHangingColon**: boolean (default: true), single line mode overrides hanging colon setting (applies also to alignSemicolons)
* **allowShortRulesOnASingleLine**: boolean (default: true), allows contracting short rules on a single line (short: < 2/3 of columnLimit)
* **alignSemicolons**: string enum (default: "none"), determines the alignment of semicolons in rules
    * **none**: no alignment, just put it at the end of the rule directly after the last token
    * **ownLine**: put it on an own line (not indented), unless **allowShortRulesOnASingleLine** kicks in
    * **hanging**: put it on an own line with indentation (aligning it so to the alt pipe chars)
* **breakBeforeParens**: boolean (default: false), for blocks: if true puts opening parentheses on an own line
* **ruleInternalsOnSingleLine**: boolean (default: false), place rule internals (return value, local variables, @init, @after) all on a single line
* **minEmptyLines**: number (default: 0), determines the number of empty lines that must exist (between rules or other full statements)
* **groupedAlignments**: boolean (default: true), when true only consecutive lines are considered for alignments
* **alignFirstTokens**: boolean (default: false), align the first token after the colon among rules
* **alignLexerCommands**: boolean (default: false), align lexer commands (starting with ->) among rules
* **alignActions**: boolean (default: false), align action blocks + predicates among rules and alternatives
* **alignLabels**: boolean (default: true), align alt labels (only when a rule is not on a single line)
* **alignTrailers**: boolean (default: false), combine all alignments (align whatever comes first: colons, comments etc.)
