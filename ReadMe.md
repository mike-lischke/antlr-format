[![Weekly Downloads](https://img.shields.io/npm/dw/antlr-format?style=for-the-badge&color=blue)](https://www.npmjs.com/package/antlr-format)
[![npm version](https://img.shields.io/npm/v/antlr-format?style=for-the-badge&color=yellow)](https://www.npmjs.com/package/antlr-format)

# <img src="https://raw.githubusercontent.com/mike-lischke/antlr-format/master/images/formatter-title.png" alt="antlr-format">

The `antlr-format` package provides a small library to format your ANTLR4 grammar in a wide variety of ways. It has a companion named `antlr-format-cli` which provides a terminal command for running the formatter in batch files and so on. You can read more about it in its own [Readme](cli/ReadMe.md).

## Installation

Nothing special here, just use NPM (or any other package manager):

```bash
npm i antlr-format
```

## Usage

Read the [formatter documentation](doc/formatting.md) for further details and a code example.

## Release Notes

### 2.1.4 - 2.1.5

- Updated dependencies.

### 2.1.3

- Stop including 3rd party libs in bundle.
- Updated dependencies.

### 2.1.2

Updated dependencies

### 2.1.1

Fixed bug #2 antlr-format produces output that isn't a fixed point, removes comments

### 2.1.0

Made `useTab` false by default. No idea why I made this true by default. I hate tabs in source files.

### 2.0.3 - 2.0.4

- Fixed bug where rule names after block comments where not placed on an own line;
- Added support for colons in blocks, which are optional and may align with alts just like on rule level.
- Added support for rule options, which are formatted like global options.
- Fixed a bug where the formatter added formatting options, even if there were already some in the grammar.

### 2.0.2

Fixed a problem related to getting raw content for output in the formatter (e.g. action text). Also changed a number of imports/settings to fix a problem with debugging the formatter in VS Code.

### 2.0.1

Added missing type definition entry in package.json.

### 2.0.0

BREAKING CHANGE:

The package has been split into a [cli wrapper](https://www.npmjs.com/package/antlr-format-cli) and the actual formatter class. This avoids inclusion of otherwise unnecessary packages, when importing this package and works around a problem with esbuild when mixing ESM and CommonJS modules running in Node.js (for example using Jest with ts-jest).

Additionally, the `GrammarFormatter` class now accepts a string with the grammar content and does the tokenization on its own. This avoids that you have to run the ANTLRv4 lexer manually (or even care for it at all).

### 1.0.0

This is the initial release of the package.
