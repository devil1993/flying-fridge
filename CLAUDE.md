# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**Flying Fridge** is a digital noticeboard for families — a modern, online take on the classic fridge-and-magnets way of sharing household information (hence "flying"). Planned features: users log in and join a family, then share **tasks, info/notices, lost & found, pantry, and questions**, with both **list and calendar views**. The goal is to capture the everyday family topics that are easily forgotten.

## Current state

The repo is **requirements-only — there is no application code yet.** The work is driven by numbered requirement files, not an existing build system.

- `requirements/overview.md` — the product vision (read first).
- `requirements/requirement-N.md` — one file per requirement batch, each with Functional / Technical / Polishing sections. New requirement files are added over time; treat each as the next unit of work.

**Ignore `.claude/settings.local.json` as a source of truth for the stack.** Its allowed commands (pnpm/vitest/vite, `khorcha-bhag`, SplitwiseClone paths) are carried over from an unrelated project and do not describe Flying Fridge's tooling.

## Requirement 1 — landing page (active)

Build a fun, modern landing page with standard landing-page sections and CTAs. Hard constraints from `requirements/requirement-1.md`:

- **Single self-contained HTML file** — all CSS/JS inline, no build step, no external dependencies. This file will later become the `index` page of the actual app, so keep it drop-in ready.
- **Light/dark theme driven by the system** (`prefers-color-scheme`), not a manual toggle unless requested.
- **Simple, fun animations.**
- **Maintain a progress plan** so future requirement files can build on prior work incrementally. Keep it updated as requirements are completed.

## Git workflow (required)

- All work must be committed to git with proper, scoped commit messages.
- **Git credentials must be local to this repo only** — never use or modify system-wide credentials. If git identity isn't configured, guide the user through per-repo setup (e.g. `git config --local user.name/user.email`, `git config --local credential.helper ...`) rather than assuming global config.

## Environment notes

- Platform is Windows; the primary shell is PowerShell, with a Bash (POSIX) tool also available. Watch for path quoting — the repo path contains spaces (`Learning and POC`).
