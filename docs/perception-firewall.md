# Perception Firewall

The perception firewall is the most important technical component in the project.

Mineflayer can expose loaded world data directly. That is useful for many bots, but it violates this project's core rule. The firewall turns raw client state into observations that approximate what a normal player could know.

## Design Goal

The planner should be able to answer:

- What can I see?
- What do I remember seeing?
- What am I carrying?
- What just happened?
- What can I safely interact with?

It should not be able to answer:

- Is there diamond ore behind this stone?
- Is there a cave twenty blocks behind this wall?
- What is inside that unopened chest?
- Where is the nearest village from the seed?

## Observation Snapshot

The planner receives snapshots like:

```ts
type ObservationSnapshot = {
  time: string
  position: { x: number; y: number; z: number }
  yaw: number
  pitch: number
  dimension: string
  health: number
  food: number
  inventory: ObservedItem[]
  visibleBlocks: VisibleBlock[]
  visibleEntities: VisibleEntity[]
  nearbyDrops: VisibleItemDrop[]
  recentEvents: ObservedEvent[]
  chat: ChatMessage[]
}
```

The exact schema can change, but every field must be player-legitimate.

## Visibility Rules

Initial pragmatic model:

- Blocks are visible only if a line from the bot eye position to an exposed face sample is not blocked by opaque geometry.
- Entities are visible only if line-of-sight is clear and they are within a configured perception radius.
- Dropped items follow entity visibility rules.
- The bot may rotate to inspect its surroundings, but each rotation is an action and should be logged.
- Recently seen things can remain in memory, but must be marked with the time and location of observation.

We do not need pixel-perfect human vision for the MVP. We need to prevent hidden server data from leaking into the mind.

## Interactable Targets

Skills should accept targets from one of these sources:

- current visible observation
- previously observed memory, with a route to reach or re-check it
- inventory
- player-provided instruction
- external strategy, if it is general and not world-specific

Skills should reject targets that only come from raw Mineflayer search.

## Forbidden API Exposure

The brain must not call:

- `bot.findBlock`
- raw chunk access
- raw world block iteration
- raw entity maps beyond firewall-filtered observations
- server files
- RCON/admin commands

Internal adapters may use some raw APIs to compute visibility, but the returned result must be filtered before it reaches the planner.

## Test Cases

Minimum firewall tests:

1. Hidden ore in loaded chunk is not visible.
2. Ore exposed in a cave wall becomes visible after line-of-sight exists.
3. Chest contents are unknown before opening.
4. Chest contents become known after normal interaction.
5. A player message is stored as player-provided, not observed fact.
6. Internet diamond strategy is stored as external research, not world observation.
7. Pathfinder cannot route toward a hidden target that the planner never legitimately acquired.

## Debugging

Use `prismarine-viewer` as a developer aid, not as agent perception authority. The viewer can help us inspect what the bot is doing, but the agent's mind should be driven by firewall snapshots and event logs.
