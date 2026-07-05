export const DIALOGUE_TREES = {
  old_man_intro: {
    id: 'old_man_intro',
    startNode: 'greeting',

    entryPoints: [
      {
        condition: { type: 'questStageAtLeast', questId: 'lost_relic', stage: 'relic_found' },
        node: 'relic_returned'
      },
      {
        condition: { type: 'questActive', questId: 'lost_relic' },
        node: 'still_looking'
      }
    ],

    nodes: {
      greeting: {
        speaker: 'Eadric the Withered',
        text: "Ah… a traveller. You see it too, don't you? The fracture in the sky.",
        choices: [
          { text: 'What fracture?', next: 'explain_fracture' },
          { text: "I don't have time for this.", next: 'dismiss' }
        ]
      },

      explain_fracture: {
        speaker: 'Eadric the Withered',
        text: 'The Cloud. It eats memory, leaves only static. Seven clues remain.',
        choices: [{ text: 'Seven clues?', next: 'clues_intro' }]
      },

      clues_intro: {
        speaker: 'Eadric the Withered',
        text: "Scattered across worlds. Find the relic first. It anchors what's left.",
        choices: [
          {
            text: 'Where is the relic?',
            next: 'relic_hint',
            effects: [{ type: 'startQuest', questId: 'lost_relic' }]
          }
        ]
      },

      relic_hint: {
        speaker: 'Eadric the Withered',
        text: 'In the marsh, where the river forgets which way is down.',
        choices: [{ text: "I'll find it.", next: 'end' }]
      },

      dismiss: {
        speaker: 'Eadric the Withered',
        text: 'Then the static will take you too. It always does.',
        choices: [{ text: 'Leave', next: 'end' }]
      },

      still_looking: {
        speaker: 'Eadric the Withered',
        text: 'Still searching? The marsh keeps its secrets close.',
        choices: [
          {
            text: 'I have the relic.',
            next: 'relic_returned',
            condition: { type: 'hasItem', itemId: 'lost_relic' },
            effects: [{ type: 'setQuestStage', questId: 'lost_relic', stage: 'relic_found' }]
          },
          { text: 'Still looking.', next: 'end' }
        ]
      },

      relic_returned: {
        speaker: 'Eadric the Withered',
        text: 'You found it. The static dims, if only a little. My thanks.',
        choices: [
          {
            text: 'Farewell.',
            next: 'end',
            effects: [{ type: 'completeQuest', questId: 'lost_relic' }]
          }
        ]
      },

      end: { text: '…', choices: [] }
    }
  }
}
