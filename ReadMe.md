[![Weekly Downloads](https://img.shields.io/npm/dw/antlr-format?style=for-the-badge&color=blue)](https://www.npmjs.com/package/antlr-format)
[![npm version](https://img.shields.io/npm/v/antlr-format?style=for-the-badge&color=yellow)](https://www.npmjs.com/package/antlr-format)

# <img src="https://raw.githubusercontent.com/mike-lischke/antlr-format/master/images/logo.svg" alt="antlr-format" style="width: 128px; height: 128px; vertical-align: bottom">Formatting Your ANTLR4 Grammars

The `antlr-format` package is a tool to format your ANTLR4 grammar in a wide variety of ways. It comes with two flavours, one being a command line application that can take a configuration file and a file pattern, to apply formatting to multiple files.

In addition you can import the `GrammarFormatter` class into your own application and use it there.

## Installation

For a local installation in your project use:

```bash
npm i --save-dev antlr-format 
```

Or as a global module, which allows you to run it everywhere on you machine:

```bash
npm i -g --save-dev antlr-format 
```

## Usage

Running the formatter tool in a terminal is easy. Switch to the project folder (or if you have the formatter installed globally use any directory) and run the command:

```bash
antlr-format --pattern MyGrammar.g4 --config config.json
```

You can omit the `--config` parameter, in which case default options are used. The `--pattern` supports the usual glob pattern for file systems, e.g. `--pattern path/**/*.g4` to format all grammars in a given folder. Grammars may contain syntax errors (e.g. for testing), but you should only use the tool for real ANTLR4 grammars, otherwise the outcome is unpredictable.

Run the tool with `--help` to have print its supported parameters. For a detailed description of the supported formatting options check out the [formatting](doc/formatting.md) documentation.