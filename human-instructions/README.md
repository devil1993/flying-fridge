# Human Instructions

This folder holds **manual setup steps that must be performed by a human, outside the code workspace.**

Claude (the AI assistant) writes the application code, but there are some things it cannot do for you — creating accounts, clicking through third-party web consoles (like the Firebase console), generating secret keys, and pasting values that only exist inside your browser session. Those steps live here as plain Markdown checklists.

## How this folder works

- **Markdown only.** Every file is a numbered, step-by-step guide you can follow at your own pace.
- **Numbered = ordered.** Files are prefixed with a two-digit number (`01-`, `02-`, …). Do them in order — later steps assume earlier ones are done.
- **Read-and-do.** Each guide tells you exactly what to click and which values to copy back into the workspace.
- **Report back.** Most guides end with a **"What to report back"** checklist. After you finish, tell the assistant which choices you made and confirm the workspace is wired. This unblocks the next requirement.

## Why this matters (prerequisite gate)

The application code depends on real infrastructure existing (for example, a Firebase project with Authentication and a database). Until you complete the relevant guide **and report the values back**, the assistant cannot build the next requirement — there would be nothing for the code to connect to.

Think of these as the "flip the switches in the real world" steps that turn the code from a shell into a working app.

## Current guides

| File | Purpose |
| --- | --- |
| `01-firebase-project-setup.md` | Create the Firebase project and wire its config into the workspace. **Do this first.** |

More guides will be added here as future requirements need additional out-of-workspace setup (for example, deploying to a host, or configuring a custom domain).
