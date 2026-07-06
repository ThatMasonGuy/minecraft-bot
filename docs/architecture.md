# Architecture

## System Shape

```text
Minecraft Server
  |
Mineflayer Client
  |
Perception Firewall
  |
Observed World Model + Event Log
  |
Goal Manager + Planner + Personality State
  |
Skill Executor
  |
Audited Mineflayer Actions
```

## Components

### Mineflayer Client

Owns the real connection to the server. It can see too much and do too much, so it must live behind adapters.

Responsibilities:

- connect and reconnect
- load approved plugins
- receive raw events
- execute approved low-level actions
- report raw action outcomes to adapters

### Perception Firewall

Converts raw Mineflayer state into player-legitimate observations.

Responsibilities:

- expose only visible or otherwise normally knowable world state
- label all observations with provenance
- deny raw block search and hidden chunk access
- create observation snapshots for the planner
- provide testable guarantees against xray-like leakage

### Event Log

Append-only perfect recall.

Responsibilities:

- record observations
- record actions and results
- record chat
- record goals and decisions
- record external research
- record failures and recoveries

The event log is the source of truth. Summaries are helpful indexes, not authority.

### Goal Manager

Chooses what the agent wants to do next.

Inputs:

- current observation snapshot
- active needs
- memory retrieval
- learned skills
- player messages
- external research summaries

Outputs:

- current goal
- rationale
- success criteria
- cancellation criteria

### Planner

Turns goals into skill calls. It should reason in tasks, not raw packets.

Examples:

- "collect wood"
- "craft wooden pickaxe"
- "dig a safe staircase mine"
- "return to base"
- "ask Mason whether this chest is okay to use"

### Skill Executor

Runs deterministic skills and records their results.

Skills should be small enough to test, but large enough to be useful. A skill can call Mineflayer APIs internally, but only after validating that the target came from legitimate perception or memory.

### External Research

Allows controlled internet lookup for general Minecraft knowledge.

Research outputs must be:

- summarized
- cited when possible
- marked as external
- separated from observed world facts

## Initial Library Choices

- `mineflayer` for Java client control.
- `mineflayer-pathfinder` for movement, wrapped because it can autonomously break/place blocks.
- `prismarine-viewer` for local debugging and first-person inspection.
- `mineflayer-collectblock` only after auditing or wrapping, because examples use `bot.findBlock`.

## Critical Boundary

No file in the planner, goal manager, personality, or LLM layer should import Mineflayer directly.

The dependency direction should be:

```text
brain -> safe interfaces -> skills -> mineflayer adapters
```

Never:

```text
brain -> mineflayer bot
```
