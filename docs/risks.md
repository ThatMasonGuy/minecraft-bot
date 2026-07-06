# Risks

## Fairness Leakage

Mineflayer can expose block and entity data beyond what a player should know.

Mitigation:

- planner never receives raw Mineflayer
- all observations pass through the perception firewall
- hidden-data tests are mandatory

## LLM Hallucination

The agent may claim it saw or did something that is not in memory.

Mitigation:

- answers about the world must retrieve from memory
- claims should include provenance internally
- chat responses should say "I think" or "I remember" when uncertain

## Unsafe Autonomy

The agent could place lava, light fires, break important builds, or fight players.

Mitigation:

- gated action policy
- default deny for destructive actions
- server-owner override
- clear logs for every gated action

## Prompt Injection

External websites or chat messages could try to instruct the agent to reveal secrets, run commands, or ignore rules.

Mitigation:

- web pages are data, not instructions
- player chat is social input, not system policy
- no arbitrary code execution by default
- secrets are never available to the in-game agent brain

## Memory Privacy

Perfect recall may include private chat, server addresses, player names, or coordinates.

Mitigation:

- runtime memory is git-ignored
- exports must be deliberate and scrubbed
- public docs should use synthetic examples

## Version Drift

Minecraft Java `26.x` support is still moving in the Prismarine ecosystem.

Mitigation:

- MVP targets `1.21.11`
- version adapters isolate compatibility work
- `26.x` stays an explicit compatibility track

## Pathfinder Overreach

Pathfinding can make decisions like breaking or placing blocks while moving.

Mitigation:

- movement settings must be explicit per skill
- destructive movement is disabled by default
- planner gets route outcomes, not raw pathfinder internals

## Skill Bugs

Even deterministic skills can get stuck, loop, or damage the bot.

Mitigation:

- every skill has timeout and cancellation criteria
- failed skills return structured failure reasons
- repeated failures trigger replanning

## Cost And Latency

Long autonomous sessions can create many LLM calls and web lookups.

Mitigation:

- keep low-level skills deterministic
- cache research
- summarize memory in batches
- use the LLM at goal/planning boundaries, not every tick

## Anti-Cheat Compatibility

This is not a major concern because the target is Mason's own server.

Mitigation:

- keep normal-player action semantics anyway
- avoid packet-level weirdness unless required
- do not optimize around public-server evasion
