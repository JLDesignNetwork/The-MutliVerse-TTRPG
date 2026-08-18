# AI Agent & Copilot Development Guidelines

> [!IMPORTANT]
> **Authoritative Rules:** Universal JLDN rules apply. Workspace-specific guidelines:
> - **Local Rules:** `.agents/AGENTS.md`
> - **Generational Hub:** `.dev/` (Active Gen: `2606`)
> - **Ruleset Source of Truth:** `docs/2606/`

## Key Invariants
1. **PNPM Monorepo:** Use `pnpm` exclusively. Global linking policy applies.
2. **Generational Backlog:** Keep `.dev/2606/backlog.json` synchronized on every task resolution.
3. **No Unstructured Tasks:** Never introduce standalone `TODO.md` or `BUGS.md` files.
