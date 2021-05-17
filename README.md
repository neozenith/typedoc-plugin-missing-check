# 🤷‍♀️ Typedoc Plugin: Missing Check 🤷‍♂️

[![CI](https://github.com/neozenith/typedoc-plugin-missing-check/actions/workflows/ci.yml/badge.svg)](https://github.com/neozenith/typedoc-plugin-missing-check/actions/workflows/ci.yml)

TypeDoc Plugin to check if typescript documentation is empty or missing.

A plugin for [TypeDoc](https://github.com/TypeStrong/typedoc) that check TypeScript API documentation actually exists and throws errors when _it is accidentally forgotten_.

## Installation

```bash
npm install --save-dev typedoc typedoc-plugin-missing-check
```

## Usage

Usage is the same as documented at [TypeDoc](https://typedoc.org/guides/installation/#command-line-interface).

```bash
typedoc src/
```

```bash
# Check only public or higher (default).
typedoc --missing-check-level public src/

# Check only protected and public.
typedoc --missing-check-level protected src/

# Check all.
typedoc --missing-check-level private src/

# Disable missingness checks.
typedoc --missing-check-disabled src/
```

## Development

Get setup

```bash
git clone https://github.com/neozenith/typedoc-plugin-missing-check
cd typedoc-plugin-missing-check
npm ci
```

Run a self check since there are no tests just yet.

```bash
npm run build
npx typedoc --plugin . src/
```
## Contributing

Report issues on Github, or more appreciated would be opening a pull request and we can collaborate on the needed change over the line.

## TODO

 - Look at [CommentPlugin](https://github.com/TypeStrong/typedoc/blob/master/src/lib/converter/plugins/CommentPlugin.ts) for how to implement the checks.