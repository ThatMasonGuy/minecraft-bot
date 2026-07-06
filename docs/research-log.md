# Research Log

Last updated: 2026-07-06.

## Mineflayer

Source: https://github.com/PrismarineJS/mineflayer

Findings:

- Mineflayer is the right control layer for a Java bot.
- The README currently documents support through Minecraft Java `1.21.11`.
- Mineflayer exposes powerful world, entity, inventory, crafting, digging, and chat APIs.
- That power is useful for implementation but unsafe for the agent brain.

Local npm check on 2026-07-06:

- `mineflayer` latest: `4.37.1`
- Node engine: `>=22`
- depends on `minecraft-data` `^3.108.0`
- depends on `minecraft-protocol` `^1.66.0`

Decision:

- Use Mineflayer behind adapters.
- Do not expose raw Mineflayer to planner, memory, or personality layers.

## Minecraft Java 26.x

Sources:

- https://www.minecraft.net/en-us/article/minecraft-java-edition-26-2
- https://github.com/PrismarineJS/minecraft-data/issues/1197
- https://github.com/PrismarineJS/mineflayer/issues/3893

Findings:

- Minecraft Java `26.2` released on 2026-06-16.
- Prismarine `minecraft-data` has an open issue tracking Java `26.2` support.
- Mineflayer has an open issue for `26.1.2` support where users reported unsupported protocol errors.

Decision:

- Target `1.21.11` for MVP.
- Keep `26.x` as a compatibility track once Prismarine support is stable.

## Voyager

Source: https://voyager.minedojo.org/

Findings:

- Voyager's useful pattern is automatic curriculum, skill library, and iterative feedback.
- Skills are temporally extended and reusable, which is exactly what long-horizon Minecraft play needs.
- Voyager uses code as action space, but this project should avoid arbitrary LLM code execution by default.

Decision:

- Adopt the curriculum/skill-library/feedback-loop idea.
- Use deterministic audited skills first.
- Treat LLM-written executable skills as a later gated experiment.

## MineDojo

Source: https://minedojo.org/

Findings:

- MineDojo frames Minecraft as an open-ended embodied-agent benchmark.
- Its internet-scale knowledge base validates our allowance for web research as a way to acquire general strategies.
- It separates environment interaction from large external knowledge sources, which matches our provenance model.

Decision:

- Allow external research for general Minecraft knowledge.
- Store research separately from observed world facts.

## Mindcraft

Source: https://github.com/mindcraft-bots/mindcraft

Findings:

- Mindcraft is an existing LLM + Mineflayer project.
- Its README explicitly warns that LLM code execution is vulnerable to injection even when sandboxed.
- It supports Minecraft Java up to `1.21.11` and recommends avoiding Node `v24+` for some native dependency cases.

Decision:

- Default `ALLOW_INSECURE_CODE_EXECUTION=false`.
- Keep prompt injection and host-code execution as first-class risks.
- If native dependency trouble appears on Node `v24`, test Node `22` LTS before debugging deeply.

## mineflayer-pathfinder

Source: https://github.com/PrismarineJS/mineflayer-pathfinder

Findings:

- Provides A* pathfinding and static/dynamic/composite goals.
- Can break/place blocks as part of movement.

Decision:

- Use it through a movement adapter.
- Disable destructive movement by default.
- Treat route targets as allowed only when they come from visible observations, memory, or player-provided instructions.

## prismarine-viewer

Source: https://github.com/PrismarineJS/prismarine-viewer

Findings:

- Useful local debugging viewer for servers and bots.
- Supports first-person examples and path drawing.
- Its documented version support trails Mineflayer's currently documented `1.21.11` support.

Decision:

- Use as developer visibility, not agent perception authority.

## mineflayer-collectblock

Source: https://github.com/PrismarineJS/mineflayer-collectblock

Findings:

- Useful convenience wrapper for collecting blocks.
- README examples use `bot.findBlock` to locate target blocks.

Decision:

- Do not expose directly to the agent brain.
- Either wrap it with perception-approved targets or implement our own collect-visible-block skill.
