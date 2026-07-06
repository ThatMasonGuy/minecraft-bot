# Memory Model

The agent is allowed perfect recall. Perfect recall does not mean perfect truth. It means every event can be recorded and retrieved with provenance.

## Memory Types

### Observation

Something the bot perceived through the game.

Examples:

- saw oak logs at a position
- opened a chest and saw contents
- took damage from a zombie
- heard chat from Mason

### Action

Something the bot attempted.

Examples:

- walked to a coordinate
- mined a visible block
- crafted sticks
- placed a torch
- replied in chat

Actions must include result:

- success
- failed
- interrupted
- cancelled
- unsafe

### Goal

A task the agent chose or accepted.

Examples:

- survive the first night
- collect logs
- build a starter shelter
- research a house design
- find iron

Goals should include:

- reason
- start time
- success criteria
- current status
- end time
- final reflection

### External Research

Information from the internet or static knowledge sources.

Examples:

- crafting recipe for a shield
- recommended diamond mining level for the target version
- starter house material list

External research can guide plans, but it cannot claim facts about the server world.

### Reflection

A summary or lesson derived from events.

Examples:

- "Night travel without food was risky."
- "The base is near spawn and has a chest with cobblestone."
- "I need more coal before long mining trips."

Reflections are useful, but the event log remains the authority.

## Provenance

Every memory record needs one of these labels:

- `observed`
- `acted`
- `inferred`
- `external_research`
- `player_provided`
- `summary`
- `system`

If the agent says "I know," it should be able to say how it knows.

## Initial Storage

Use SQLite locally for MVP:

- easy to inspect
- file-based
- good enough for append-only event logs
- can later move to Postgres if needed

Runtime databases are ignored by git. Schema migrations and sample fixtures can be committed later, but live memory should not be committed.

## Suggested Tables

```text
events
  id
  created_at
  type
  provenance
  summary
  payload_json

goals
  id
  created_at
  updated_at
  status
  title
  reason
  success_criteria_json
  parent_goal_id

actions
  id
  goal_id
  created_at
  skill
  input_json
  result_status
  result_json

research_notes
  id
  created_at
  query
  source_url
  summary
  applies_to_version

reflections
  id
  created_at
  source_event_ids_json
  summary
  confidence
```

## Answering Players

When a player asks what the agent is doing, the answer should come from active goals and recent actions.

When a player asks what it has done, the answer should come from event-log retrieval.

When a player asks why it chose something, the answer should cite the goal reason, relevant memories, and any external research used.
