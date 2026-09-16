# Þræscype

*"I'm not telling you who or what this is. Yet. But it's not what you think it is."*

You wake in the Fractured Worlds with no memory of who you are. In your hands: a triangular piece of engraved metal, and nothing else. Somewhere across twenty broken worlds, connected by portals that shouldn't exist, the truth of what happened to Elveria — and to you — is waiting to be found.

Þræscype is a browser-based exploration and narrative RPG built with React. It's a slow, melancholy game about wandering, survival, and the unreliable stories people tell about a catastrophe none of them fully understood.

---

## Playing the game

```
npm install
npm run dev
```

Then open the local URL Vite gives you. No backend, no account, no install beyond the usual — everything runs client-side, and your progress saves automatically to your browser's local storage.

### Controls

- **Arrow keys / WASD** — move, one tile per press
- **Inventory** button (side panel) — view, consume, read, drop, or combine items
- **New Game** button (side panel) — starts fresh, generating a brand new set of twenty worlds
- Walking into an NPC, item, or points of interest opens dialogue or interaction automatically

There's no fail state from ordinary exploration — but neglecting food, water, and rest has real consequences (see **Stamina & Constitution** below).

---

## What's actually in the game

**Twenty procedurally generated worlds**, each with its own terrain (plains, forest, swamp, hills, mountains, rock, water), connected by a portal network engineered to guarantee full connectivity — no isolated clusters, no dead ends, however the randomness lands.

**Survival mechanics** — Stamina drains from exertion (rock, hills, deep water) and regenerates slowly on its own; Constitution only takes damage if you keep pushing on while stamina is fully spent. Eating and drinking restore stamina; herbs and dedicated medicine restore constitution. Let either run out for long enough, and it's game over.

**A weight-limited inventory** with a craftable bag to expand capacity, and a genuine combine/crafting system — some materials found in the world can be worked together into tools, food, and stranger things, once you know what goes with what.

**Dozens of NPCs**, from major quest-givers to purely atmospheric wanderers who gossip, grieve, observe, or talk complete nonsense — several of them unreliable narrators, deliberately. Dialogue is driven by a custom gamebook-style engine supporting branching conversations, quest-stage tracking, and conditions that check the *combination* of things you've learned or done, regardless of the order you did them in.

**A wandering, sentient Cloud** that drifts between worlds, occasionally vanishing and reappearing elsewhere — atmospheric at first, meaningfully more than that later on.

**Scarce, huntable wild boars**, native to hill and forest terrain, that appear briefly and vanish if you don't reach them in time.

**The Witch's Lair** — an 8×8 ring of mountains with exactly one entrance, hiding someone considerably older than the apocalypse that shattered this world.

**A layered central mystery**, told through unreliable narrators, old letters, recovered memories, and a translation puzzle that only makes sense once you have the right two objects in hand at the same time.

---

## Project structure

```
src/
  App.jsx, main.jsx, index.css

  components/
    Item.jsx, NPC.jsx, BackgroundMusic.jsx

  engine/
    Game.jsx                    — the whole game loop lives here
    interaction/
      InteractionModal.jsx      — renders dialogue, items, inventory, messages
    inventory/
      weight.js                 — carry capacity logic
      recipes.js                — the combine/crafting system
    player/
      vitals.js                 — stamina & constitution
    save/
      storage.js                — versioned localStorage save/load
    world/
      worldGenerator.js         — terrain generation, terrain-weighted item spawning
      worldNetwork.js           — the 20-world portal network (connectivity-guaranteed)
      cloudSystem.js
      boarSystem.js
      witchsLair.js
      npcPlacement.js / eadricPlacement.js / plantPlacement.js
    gamebook/
      state.js, conditions.js, effects.js, questMapper.js, dialogueEngine.js, index.js
      — a small, reusable dialogue/quest engine: declarative conditions
        (flags, items, quest stages, and/or/not, "at least N of these"),
        declarative effects (give/remove items, set flags, start/advance/
        complete quests), and order-independent entry-point routing.

  data/
    quests.js
    entities/
      items.js, npcData.js, characterNames.js, cloudShape.js
    dialog/
      dialogTrees.js
    factories/
      entityFactory.js

public/
  audio/                        — background music tracks (looping playlist)

```

The gamebook engine in particular is written to be reusable beyond this specific game — nothing in `engine/gamebook/` knows anything about Þræscype, Elveria, or any of the specific content; it's a general-purpose declarative dialogue and quest system that this game's content happens to be built on top of.

---

## Technical notes

- Built with **React** and **Vite**, styled with plain CSS — no UI framework, no external state management library.
- All game state is plain, serialisable data (flags, quest stages, inventory as an array of item IDs) — nothing in the save file is a class instance or a function, so it round-trips through `JSON.stringify`/`parse` cleanly.
- The save format is versioned (`SAVE_VERSION` in `storage.js`); loading a save from an incompatible older version is treated as no save at all, rather than loading something that would half-work.
- World generation, the portal network, dialogue routing, and the combine system are all pure functions with no React dependency — they're testable in isolation from the UI.

---

## Status

Content-complete for its intended single arc. A few smaller systems (additional crafting recipes, further world population) are easy to extend given the existing patterns, but the core story from first waking to the closing black screen is finished.
