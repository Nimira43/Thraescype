import { registerQuests } from '../engine/gamebook'

export const QUESTS_DATA = [
  {
    id: 'lost_relic',
    name: 'The Lost Relic',
    startStage: 'started',
    stageOrder: ['started', 'relic_found', 'completed'],
    stages: {
      started:     { description: 'Find the relic, said to rest in the marsh.' },
      relic_found: { description: 'Return the relic to Eadric.' },
      completed:   { description: 'The relic rests with Eadric once more.' }
    }
  }
]

// Registering at import time means anything that imports this module
// (even just for its side effect) guarantees QUESTS is populated before
// any dialogue condition/effect touches quest state.
registerQuests(QUESTS_DATA)