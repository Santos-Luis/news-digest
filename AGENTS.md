# News Digest Agent Guide

This file captures the portable code style rules inferred from `../taskdeck/AGENTS.md` for this Astro
project.

## Programming Style

- Prefer functional programming.
- Export plain stateless named functions with explicit arguments and dependencies.
- Do not use arrow functions for file-level exported or module-level functions.
- Use arrow functions for callbacks and inline behavior passed to array methods, promise methods, object
  properties, Astro component expressions, and similar nested call sites.
- Do not use classes or factory functions that return method objects.
- If behavior needs configuration, pass that configuration as explicit function arguments or plain data
  dependencies.
- If a function has more than 2 arguments, use named arguments with a single object parameter.
- For named arguments, prefer destructuring in the function signature.

## File And Function Design

- Favor small, focused files with one clear purpose.
- Keep boundaries easy to understand and test independently.
- If a file starts accumulating unrelated responsibilities, split it.

## Formatting

- Use the local Prettier and ESLint config.
- TypeScript, JavaScript, and Astro source use tabs, single quotes, semicolons, and trailing commas.
- Markdown and JSON use two spaces and preserve prose wrapping where configured.
