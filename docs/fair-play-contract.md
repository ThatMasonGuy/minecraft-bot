# Fair Play Contract

This document is the rulebook for keeping the agent honest.

## Allowed Knowledge

The agent may know:

- what is visible from its current or recently observed viewpoint
- what it has in inventory, armor, offhand, XP, health, hunger, saturation, and active effects
- chat messages it receives
- sounds, damage, deaths, weather, time, and other normal client events
- positions and states it has previously observed
- crafting recipes and general Minecraft strategies found online
- facts explicitly told to it by players, marked as player-provided
- summaries derived from its own recorded events

## Forbidden Knowledge

The agent must not know:

- hidden ore locations from chunk data
- hidden caves, structures, mobs, or blocks behind opaque walls
- container contents before opening the container normally
- seed-derived coordinates for biomes, structures, slime chunks, or treasures
- admin/RCON/server console state
- raw Mineflayer block scans, unless passed through the perception firewall
- anything from server files, world saves, plugins, or backups

## Allowed Actions

The agent may:

- walk, sprint, sneak, jump, swim, climb, and ride
- look around and inspect visible surroundings
- mine blocks it can legally reach
- collect dropped items it can reach
- craft recipes it knows or has researched
- use furnaces, chests, beds, doors, boats, minecarts, and other normal interactables
- fight hostile mobs
- build from a remembered or researched plan
- talk to players in chat
- ask for help or clarification

## Gated Actions

These actions need explicit policy support before being enabled:

- TNT, fire, lava, and flint-and-steel usage
- PvP
- taking from player-owned chests
- entering restricted player bases
- large-scale demolition
- Nether or End progression
- running commands
- writing executable skills from LLM-generated code

## Enforcement

The planner must not receive the raw Mineflayer `bot` object.

Instead, it receives:

- observation snapshots from the perception firewall
- memory records with provenance
- a catalog of allowed high-level skills
- action results and failure reasons

Tests should prove that hidden loaded data does not leak. Example: place diamond ore behind stone in a loaded chunk. The raw Mineflayer layer may technically be able to see it, but the planner must not receive it until the bot exposes it through normal play.

## Internet Use

Internet research is allowed for general knowledge:

- "How do I craft a shield?"
- "What Y level is good for diamonds in this version?"
- "Show me starter house ideas."
- "What materials do I need for an enchanting setup?"

Internet research is not allowed to become world knowledge:

- "Where are diamonds in this seed?"
- "Where is the nearest village on this server?"
- "What is inside this unseen chest?"

External knowledge must be stored as `external_research`, not `observed`.
