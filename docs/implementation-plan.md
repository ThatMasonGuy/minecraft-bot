# Implementation Plan

This is the build order for turning the design docs into a working agent.

The main strategy is to build the spine before the brain:

1. define safe interfaces
2. connect Mineflayer behind adapters
3. record trustworthy events
4. enforce perception boundaries
5. add deterministic skills
6. add the control loop
7. add LLM planning
8. add web research and long-session behavior

Do not start by wiring an LLM directly to Mineflayer. That would make the project exciting for about ten minutes and then impossible to trust.

## Current Package Baseline

Checked on 2026-07-06:

- `mineflayer`: `4.37.1`
- `mineflayer-pathfinder`: `2.4.5`
- `prismarine-viewer`: `1.33.0`
- `typescript`: `6.0.3`
- `tsx`: `4.23.0`
- `vitest`: `4.1.9`
- `zod`: `4.4.3`
- `dotenv`: `17.4.2`
- `pino`: `10.3.1`

Local Node is `v24.12.0`. `node:sqlite` is available but still emits an experimental warning, so storage should be behind an interface. Start with in-memory and JSONL stores for development/tests, then add SQLite once the event schema settles.

## Target Repository Shape

```text
src/
  index.ts
  config/
    env.ts
  types/
    observation.ts
    memory.ts
    plan.ts
    skills.ts
  minecraft/
    mineflayer-client.ts
    pathfinder-adapter.ts
    viewer.ts
  perception/
    firewall.ts
    visibility.ts
    snapshots.ts
  memory/
    event-store.ts
    jsonl-event-store.ts
    sqlite-event-store.ts
  skills/
    look-around.ts
    chat.ts
    move-to.ts
    mine-visible-block.ts
    collect-visible-drop.ts
    craft.ts
  control/
    reflex-layer.ts
    goal-manager.ts
    plan-lease-runner.ts
  llm/
    planner-client.ts
    prompts.ts
    schemas.ts
  research/
    research-client.ts
    research-policy.ts
test/
  unit/
  integration/
docs/
```

The important dependency rule:

```text
control/llm/memory/perception types -> safe ports -> minecraft adapters -> Mineflayer
```

Only `src/minecraft/*` should import Mineflayer directly.

## Phase 1: Project Scaffold

Goal: make the repo runnable and testable without connecting to Minecraft yet.

Changes:

- add `package.json`
- add `tsconfig.json`
- add TypeScript source folders
- add `vitest`
- add `tsx` dev runner
- add `dotenv` and `zod` env validation
- add `pino` logging
- add placeholder `src/index.ts`

Acceptance criteria:

- `npm test` runs
- `npm run typecheck` runs
- `npm run dev` starts and exits cleanly or prints config-safe startup info
- `.env` stays ignored

Suggested commit:

- `Scaffold TypeScript project`

## Phase 2: Core Contracts

Goal: define the stable interfaces before implementation details creep in.

Add types for:

- `ObservationSnapshot`
- `VisibleBlock`
- `VisibleEntity`
- `ObservedEvent`
- `MemoryEvent`
- `PlanLease`
- `Skill`
- `SkillContext`
- `SkillResult`
- `BotClientPort`
- `EventStore`

Acceptance criteria:

- planner/control code can compile against interfaces without Mineflayer imports
- unit tests can create fake observations and fake bot clients

Suggested commit:

- `Define core agent contracts`

## Phase 3: Event Store MVP

Goal: record everything important before the bot starts doing real work.

Start with:

- in-memory event store for tests
- JSONL event store for local development
- event provenance helpers
- event append and query-by-recent APIs

Defer SQLite until the schema has survived real usage.

Acceptance criteria:

- events are append-only
- events include provenance
- tests cover observations, actions, goals, research notes, and reflections

Suggested commit:

- `Add event store foundation`

## Phase 4: Mineflayer Connection Adapter

Goal: connect to the server but expose only a safe client port upward.

Add:

- env-driven Mineflayer connection
- connect/disconnect lifecycle events
- chat receive/send adapter
- basic inventory and player state reads
- optional viewer startup
- no planner or LLM yet

Acceptance criteria:

- bot can join the configured server
- bot can log spawn/disconnect/chat events
- bot can answer a hardcoded `status` message from local state
- no non-minecraft layer imports Mineflayer

Suggested commit:

- `Add Mineflayer connection adapter`

## Phase 5: Perception Firewall MVP

Goal: make the bot see only what it should.

Add:

- observation snapshot builder
- visible block filtering
- visible entity filtering
- inventory snapshot
- recent event inclusion
- synthetic visibility tests
- integration smoke test where possible

Acceptance criteria:

- hidden blocks in loaded data do not appear in snapshots
- exposed blocks do appear
- chest contents are unknown until opened
- observations are labeled as `observed`

Suggested commit:

- `Implement perception firewall MVP`

## Phase 6: First Deterministic Skills

Goal: let the body do useful things under strict constraints.

Start with:

- `lookAround`
- `say`
- `moveToKnownTarget`
- `mineVisibleBlock`
- `collectVisibleDrop`
- `craftFromInventory`
- `eatIfNeeded`

Rules:

- every skill validates target provenance
- every skill has a timeout
- every skill returns structured success/failure
- every skill logs action events

Acceptance criteria:

- skills can run against fake ports in unit tests
- skills reject targets that did not come from observation, memory, or player input
- pathfinder cannot be called with a hidden block target

Suggested commit:

- `Add initial deterministic skills`

## Phase 7: Plan Lease Runner

Goal: give the body bounded autonomy without calling the LLM constantly.

Add:

- `PlanLease` schema
- step runner
- budget tracking
- stop-condition checks
- lease summary generation
- repeated failure detection

Acceptance criteria:

- a fake lease can run multiple skills
- lease stops on timeout, danger, success, or repeated failure
- lease summary is stored in memory

Suggested commit:

- `Add plan lease runner`

## Phase 8: Reflex Layer

Goal: respond to danger immediately.

Add reflexes for:

- critical health
- critical hunger
- hostile entity too close
- drowning
- lava/fire/fall danger
- stuck movement

Acceptance criteria:

- reflexes can interrupt a running lease
- reflex actions are logged
- reflexes do not require LLM calls

Suggested commit:

- `Add reflex safety layer`

## Phase 9: Rule-Based Goal Manager

Goal: get autonomous behavior before adding LLM variability.

Initial rule goals:

- survive immediate danger
- eat if hungry
- collect wood if no tools
- craft basic tools
- collect stone
- make shelter near a remembered safe spot
- answer simple chat questions from current goal/memory

Acceptance criteria:

- bot can choose a goal from state
- bot can explain the active goal from stored reason
- bot can run a plan lease without an LLM

Suggested commit:

- `Add rule-based goal manager`

## Phase 10: LLM Planner

Goal: use the LLM for judgment, not motor control.

Add:

- provider interface
- structured output schema for plan leases
- compact state packet builder
- prompt with fair-play rules
- retry and validation logic
- fallback to rule-based goals if LLM fails

Acceptance criteria:

- LLM output must validate before execution
- LLM never receives raw Mineflayer data
- invalid plans are rejected with recorded reasons
- simple status answers can still be served without the LLM

Suggested commit:

- `Add structured LLM planner`

## Phase 11: Research Boundary

Goal: let the agent learn Minecraft knowledge without world cheating.

Add:

- research policy
- allowed/disallowed query classifier
- source summary storage
- version-specific notes
- prompt-injection handling

Acceptance criteria:

- recipe and strategy lookups are allowed
- seed/world-coordinate locator requests are rejected
- research is stored as `external_research`

Suggested commit:

- `Add external research boundary`

## Phase 12: Real Survival Milestones

Goal: prove the system works in normal play.

Milestones:

1. join server and answer status
2. look around and describe visible surroundings
3. collect visible wood
4. craft wooden tools
5. collect stone
6. craft stone tools
7. survive first night
8. make a small shelter
9. explain what it did from memory
10. start a legitimate mining strategy

Each milestone should get tests or a repeatable smoke checklist.

Suggested commits:

- one commit per meaningful milestone

## First Code Slice

The first implementation session should do only Phase 1:

- package scaffold
- env loader
- logger
- test runner
- empty module layout

Do not connect to Minecraft in the first code slice. A clean scaffold gives us a stable floor and keeps the first commit easy to review.

## Definition Of Done

A phase is done when:

- tests pass
- typecheck passes
- docs are updated if behavior changed
- no secrets or runtime state are tracked
- raw Mineflayer access has not leaked upward
- the change is committed with a plain human commit message
