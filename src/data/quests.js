import { registerQuests } from '../engine/gamebook'

export const QUESTS_DATA = [
  {
    id: 'eadric_heirlooms',
    name: "Eadric's Heirlooms",
    startStage: 'started',
    stageOrder: ['started', 'completed'],
    stages: {
      started: { description: 'Eadric has asked you to find three keepsakes lost from his family: a carved stone, a tarnished locket, and a cracked pipe.' },
      completed: { description: 'All three keepsakes have been returned to Eadric.' }
    }
  },
  {
    id: 'clue_a_stele',
    name: 'The Weathered Stele',
    startStage: 'started',
    stageOrder: ['started', 'completed'],
    stages: {
      started: { description: 'Osric spoke of a stele somewhere, marked with strange engravings.' },
      completed: { description: 'The stele has been found and studied.' }
    }
  },
  {
    id: 'clue_b_friend',
    name: "Eanflaed's Friend",
    startStage: 'started',
    stageOrder: ['started', 'completed'],
    stages: {
      started: { description: "Eanflaed has asked you to find a missing friend of hers." },
      completed: { description: "Eanflaed's friend has been found and thanked." }
    }
  },
  {
    id: 'clue_c_plant',
    name: 'The Everlasting Plant',
    startStage: 'started',
    stageOrder: ['started', 'completed'],
    stages: {
      started: { description: 'Oswald spoke of a rare plant, somewhere in the hills, said to grant everlasting youth.' },
      completed: { description: 'The plant has been found.' }
    }
  },
  {
    id: 'raevanna_tasks',
    name: "Raevanna's Tasks",
    startStage: 'started',
    stageOrder: ['started', 'completed'],
    stages: {
      started: { description: 'Raevanna has asked for three small tributes: meat from the hills, herbs from the green, and clean water.' },
      completed: { description: "Raevanna's tasks are complete. She spoke of the Cloud." }
    }
  }
]

registerQuests(QUESTS_DATA)


// import { registerQuests } from '../engine/gamebook'

// export const QUESTS_DATA = [
//   {
//     id: 'eadric_heirlooms',
//     name: "Eadric's Heirlooms",
//     startStage: 'started',
//     stageOrder: ['started', 'completed'],
//     stages: {
//       started: { description: 'Eadric has asked you to find three keepsakes lost from his family: a carved stone, a tarnished locket, and a cracked pipe.' },
//       completed: { description: 'All three keepsakes have been returned to Eadric.' }
//     }
//   },
//   {
//     id: 'clue_a_stele',
//     name: 'The Weathered Stele',
//     startStage: 'started',
//     stageOrder: ['started', 'completed'],
//     stages: {
//       started: { description: 'Osric spoke of a stele somewhere, marked with strange engravings.' },
//       completed: { description: 'The stele has been found and studied.' }
//     }
//   },
//   {
//     id: 'clue_b_friend',
//     name: "Eanflaed's Friend",
//     startStage: 'started',
//     stageOrder: ['started', 'completed'],
//     stages: {
//       started: { description: "Eanflaed has asked you to find a missing friend of hers." },
//       completed: { description: "Eanflaed's friend has been found and thanked." }
//     }
//   },
//   {
//     id: 'clue_c_plant',
//     name: 'The Everlasting Plant',
//     startStage: 'started',
//     stageOrder: ['started', 'completed'],
//     stages: {
//       started: { description: 'Oswald spoke of a rare plant, somewhere in the hills, said to grant everlasting youth.' },
//       completed: { description: 'The plant has been found.' }
//     }
//   }
// ]

// registerQuests(QUESTS_DATA)