# Minecraft Bot

An experimental AI "person" that lives inside a Minecraft server as a normal player. It should survive, learn, plan, build, mine, chat, remember what happened, and choose its own goals without using hidden server knowledge.

The target environment is Mason's own Minecraft server. We are not optimizing for public-server anti-cheat compatibility, but the repo is public, so secrets and live runtime data must stay in local `.env` and ignored runtime folders.

## Current Status

This repo is in the Phase 1 scaffold stage. It has a TypeScript project skeleton, env validation, logging, and tests, but it does not connect to Minecraft yet.

Initial stance:

- MVP Minecraft target: Java `1.21.11`, because Mineflayer currently documents support through that line.
- Experimental future target: Java `26.x`, once Prismarine/Mineflayer support is stable enough to avoid protocol work becoming the project.
- Control layer: Mineflayer, wrapped behind a strict perception and action boundary.
- Memory: perfect recall is allowed, but every memory must say whether it came from in-world observation, inference, external research, or a summary.

## Core Rule

The agent can only know what a normal player could know from playing the game, plus perfect recall and internet research.

That means it can:

- Look around, move, mine, craft, fight, eat, sleep, build, and chat.
- Remember everything it has legitimately observed.
- Search the internet for recipes, strategies, build references, and general Minecraft knowledge.

It cannot:

- Scan chunks for diamonds or structures.
- Use xray-like block searches.
- Read hidden containers or unseen caves.
- Use seed/worldgen data to locate resources.
- Treat raw Mineflayer world state as its own perception.

## Docs

- [Vision](docs/vision.md)
- [Fair Play Contract](docs/fair-play-contract.md)
- [Architecture](docs/architecture.md)
- [Control Loop](docs/control-loop.md)
- [Implementation Plan](docs/implementation-plan.md)
- [Perception Firewall](docs/perception-firewall.md)
- [Memory Model](docs/memory-model.md)
- [Roadmap](docs/roadmap.md)
- [Risks](docs/risks.md)
- [Research Log](docs/research-log.md)

## Local Configuration

Copy `.env.example` to `.env` and fill in real values locally. Do not commit `.env`, auth caches, database files, chat logs, or memory dumps.

Important local-only values include:

- `MINECRAFT_HOST`
- `MINECRAFT_PORT`
- `MINECRAFT_USERNAME`
- `MINECRAFT_AUTH`
- `OPENAI_API_KEY`
- `DATABASE_URL`

## Development

Install dependencies:

```sh
npm install
```

Run the scaffold:

```sh
npm run dev
```

Check the project:

```sh
npm run typecheck
npm test
```

## Design Bias

This project should prefer:

- deterministic low-level skills over LLM-controlled raw actions
- auditable event logs over vague summaries
- explicit provenance over confident claims
- a small safe interface over exposing Mineflayer directly
- local server reality over generic public-server assumptions
