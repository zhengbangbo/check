# @bob/check [![JSR](https://jsr.io/badges/@bob/check)](https://jsr.io/@bob/check)

A tool to check if your Node.js, Deno, and Rust versions are up to date.

![Screenshot](./images/screenshot1.png)

## Installation

Run the following command to install:

```bash
deno install -g -A jsr:@bob/check
```

> The `-g` flag installs a package or script as a globally available executable.
> The `-A` flag grants all permissions to the tool.

If you want to update the tool, run:

```bash
deno install -g -A -f -r jsr:@bob/check
```

> The `-f` flag is used to forcefully overwrite an existing installation.
> The `-r` flag is used to reload the source code cache, triggering a recompilation of TypeScript.

## Usage

Run the tool:

```bash
check
```

## Uninstall

Run the following command to uninstall:

```bash
deno uninstall -g check
```

## License

[MIT](./LICENSE) Copyright © 2025-PRESENT [Bob Zheng](https://github.com/bobz25)
