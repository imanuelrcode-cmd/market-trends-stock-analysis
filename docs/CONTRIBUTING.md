# Contributing

## Current Phase

This repository is still in the scaffold and design stage. Structure,
documentation, and architectural decisions currently matter more than draft
implementation code.

## Guidelines

- Use feature branches for changes of any size.
- Keep documentation in sync with structural changes.
- Prefer small, clear commits with descriptive messages.
- Keep modules separated by responsibility.
- Treat exploratory scripts as disposable until they are promoted into a
  supported workflow.
- Add tests when a workflow becomes stable enough to support them.

## Before Opening a PR

- Confirm the repository structure still matches the docs.
- Check that generated data, logs, and local environment files are ignored.
- Avoid introducing placeholder dependencies unless they are truly needed.
- Record important architectural decisions in the `docs/` folder.
