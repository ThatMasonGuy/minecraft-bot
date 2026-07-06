# Vision

## What We Are Building

We are building an AI person that lives inside a Minecraft server as a normal survival player.

The agent should:

- join the server as a player
- perceive the world through an intentionally limited player-like interface
- choose its own goals
- execute normal Minecraft actions
- remember what it has seen and done
- answer questions from players in chat
- use internet knowledge for recipes, strategies, and build inspiration
- improve over time through a reusable skill library

The important feeling is not "a bot that can automate Minecraft." It is "someone is in the world, doing things, learning, and able to talk about their life there."

## Scope

This will run on Mason's own server. Public-server anti-cheat compatibility is not a product requirement. We still keep the repo safe for public release:

- secrets live in `.env`
- runtime state is ignored by git
- memory exports must be deliberate and scrubbed
- any account tokens or server-specific chat logs are local-only

## Core Principles

1. **Embodied first**
   The bot acts through a Minecraft player body. Its plans must resolve into normal game actions like walking, looking, mining, crafting, placing, eating, sleeping, fighting, and chatting.

2. **Fair play by construction**
   Mineflayer can expose more world data than a human player could know. The agent brain must never receive that raw data.

3. **Perfect recall with provenance**
   The agent may remember everything, but every remembered fact needs a source: observed, inferred, externally researched, player-told, or summarized.

4. **Autonomy with local control**
   The agent can choose its own goals, but the server owner can pause, inspect, constrain, or reset it.

5. **Personality without fake omniscience**
   The agent can have preferences, curiosity, habits, and a voice. It should not pretend to have seen, done, or known things that are not in memory.

## Non-Goals

- Beating public-server anti-cheat.
- Building a xray, chunk scanner, or admin-control tool.
- Letting an LLM execute arbitrary code on the host.
- Optimizing speedrun performance at the expense of player-like behavior.
- Replacing normal server moderation or backups.
