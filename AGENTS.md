# Repository Rules

These rules apply to all work in this repository.

## Read First

Before making design or implementation changes, read:

- `README.md`
- `docs/fair-play-contract.md`
- `docs/architecture.md`
- `docs/implementation-plan.md`
- `docs/perception-firewall.md`
- `docs/memory-model.md`
- `docs/risks.md`

The core project rule is that the Minecraft agent must only know what a normal player could know, plus perfect recall and allowed external research.

## Secrets And Runtime Data

This is a public repo. Keep secrets and live runtime data local.

- Do not commit `.env` files other than `.env.example`.
- Do not commit Minecraft account tokens, API keys, server credentials, chat logs, live memory databases, or local runtime dumps.
- Keep runtime state under ignored paths such as `runtime/`, `data/local/`, or `memory/local/`.

## Commits

Commit after every major change.

If one work session contains multiple major changes, split them into multiple commits in that same session. Examples:

- docs foundation and code scaffold should be separate commits
- perception firewall implementation and memory schema should be separate commits
- feature work and unrelated cleanup should be separate commits

Small mechanical edits that belong to the same logical change can share a commit.

## Commit Attribution

Do not credit ChatGPT, Claude, Codex, OpenAI, Anthropic, or any other AI tool in commit messages, commit bodies, PR text, changelogs, or generated file headers.

Do not add `Co-authored-by` trailers for AI tools.

Commit messages should describe the change plainly, for example:

- `Initialize project documentation`
- `Add perception firewall tests`
- `Implement memory event log`

## Implementation Boundaries

- Do not expose the raw Mineflayer `bot` object to planner, goal manager, memory, personality, or LLM layers.
- Treat `bot.findBlock`, raw chunk iteration, server files, RCON, and seed/worldgen lookup as forbidden knowledge sources for the agent brain.
- Use adapters and audited skills for Minecraft actions.
- Store observed, inferred, player-provided, external-research, and summary facts with explicit provenance.

## Development Bias

- Prefer deterministic low-level skills over raw LLM-controlled actions.
- Prefer append-only event logs over vague summaries.
- Prefer small, testable interfaces around Mineflayer plugins.
- Keep public-server anti-cheat compatibility out of scope unless explicitly requested.
