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

# Enable more verbose error messages.
typedoc --missing-check-verbose src/
```

These options can also be configured in your `typedoc.json` or `tsconfig.json` like so:

`typedoc.json`
```json
{
    "missing-check-disabled": false,
    "missing-check-verbose": false,
    "missing-check-level": "public"
}
```

`tsconfig.json`
```json
{
    "compilerOptions": {
        ...
    },
    "typedocOptions": {
        "missing-check-disabled": false,
        "missing-check-verbose": false,
        "missing-check-level": "public"
    }    
}
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

Report issues on Github, or more appreciated would be opening a pull request and we can collaborate on getting the needed change over the line.

Since you will need to create a fork to open up a new PR, you can also then immediately use your updated version with:

```bash
npm install --save-dev https://github.com/{USER}/typedoc-plugin-missing-check/tarball/{BRANCH}
```

See this Stackoverflow article ["How to install an npm package from github directly?"](https://stackoverflow.com/questions/17509669/how-to-install-an-npm-package-from-github-directly) for more details.

Then revert back to using this version once your PR is accepted and published:

```bash
npm install --save-dev typedoc-plugin-missing-check
```

## TODO

### Next 

 - Create jest test suite
 - Handle missing class constructor docs
 - Handle missing method docs 

### Later

 - Automate process publishing of docs and to npm process after successful CI and merge to `main`.
 - Automate Github Release page.