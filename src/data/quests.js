import { registerQuests } from '../engine/gamebook'

export const QUESTS_DATA = [
  {
    id: 'eadric_heirlooms',
    name: "Eadric's Heirlooms",
    startStage: 'started',
    stageOrder: ['started', 'completed'],
    stages: {
      started: {
        description: 'Eadric has asked you to find three keepsakes lost from his family: a carved stone, a tarnished locket, and a cracked pipe.'
      },
      completed: {
        description: 'All three keepsakes have been returned to Eadric.'
      }
    }
  }
]

registerQuests(QUESTS_DATA)