# Roadmap

## Phase 0: Foundation

Goal: make the project shape clear before code.

Deliverables:

- git repo
- README
- fair-play contract
- architecture doc
- perception firewall spec
- memory model
- risk list
- research log
- `.env.example` and secret hygiene

Acceptance criteria:

- a new contributor can explain what the bot is and is not allowed to know
- no secrets or runtime state are tracked by git
- Mineflayer version stance is documented

## Phase 1: Minimal Embodiment

Goal: join a local or personal server as a normal player.

Deliverables:

- TypeScript project skeleton
- environment config loader
- Mineflayer connection adapter
- chat receive/send adapter
- basic event logging
- local viewer option

Acceptance criteria:

- bot joins the target server
- bot can answer "what are you doing?"
- bot records connection, spawn, chat, and disconnect events
- no LLM layer imports Mineflayer directly

## Phase 2: Perception Firewall MVP

Goal: expose only legitimate observations.

Deliverables:

- observation snapshot schema
- visible block filter
- visible entity filter
- inventory snapshot
- recent event stream
- tests for hidden data leakage

Acceptance criteria:

- hidden ore in loaded chunks is not visible to the planner
- exposed blocks become visible only after line-of-sight exists
- chest contents are unknown until normal interaction

## Phase 3: Deterministic Skills

Goal: give the planner useful, auditable actions.

Initial skills:

- look around
- walk to visible or remembered target
- mine visible block
- collect visible item drop
- craft recipe from inventory
- place block
- eat food
- flee hostile mob
- sleep in bed
- store item in opened chest

Acceptance criteria:

- each skill records input, output, and failure reason
- each skill validates that its target came from allowed perception or memory
- no skill gives the planner hidden data as a side effect

## Phase 4: Goal Manager

Goal: let the agent choose useful short-term goals.

Initial drives:

- survive
- eat
- avoid immediate danger
- improve tools
- gather basic resources
- make shelter
- explore nearby area
- respond to players

Acceptance criteria:

- bot can choose between at least three goals based on state
- bot can explain why a goal is active
- bot can abandon a goal when unsafe or impossible

## Phase 5: Internet Research

Goal: allow general Minecraft knowledge without world cheating.

Deliverables:

- research query tool boundary
- source summaries
- provenance labels
- prompt-injection handling
- version-specific knowledge notes

Acceptance criteria:

- recipe lookup can inform crafting
- strategy lookup can inform mining plans
- seed or server-specific locator requests are rejected

## Phase 6: Long-Horizon Play

Goal: the bot can live for multi-hour sessions.

Deliverables:

- memory retrieval
- reflections
- recurring self-checks
- base tracking
- resource needs
- failure recovery

Acceptance criteria:

- bot survives a normal first night from a fresh start
- bot can progress from wood to stone tools
- bot can plan and build a small shelter
- bot can summarize what happened in the session

## Phase 7: 26.x Compatibility Track

Goal: move to Java `26.x` when the ecosystem is ready.

Deliverables:

- version adapter
- compatibility smoke tests
- Mineflayer/Prismarine issue tracking
- upgrade notes

Acceptance criteria:

- the same perception firewall tests pass on the target `26.x` server
- basic movement, chat, inventory, mining, and crafting work
- protocol/library work does not weaken the fair-play boundary
