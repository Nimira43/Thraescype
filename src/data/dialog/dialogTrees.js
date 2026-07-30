export const DIALOGUE_TREES = {
  old_man_intro: {
    id: 'old_man_intro',
    startNode: 'greeting',

    entryPoints: [
      {
        condition: {
          type: 'questStageAtLeast',
          questId: 'lost_relic',
          stage: 'relic_found'
        },
        node: 'relic_returned'
      },
      {
        condition: {
          type: 'questActive',
          questId: 'lost_relic'
        },
        node: 'still_looking'
      }
    ],

    nodes: {
      greeting: {
        speaker: 'Eadric the Withered',
        text: "Ah… a traveller. You see it too, don't you? The fracture in the sky.",
        choices: [
          {
            text: 'What fracture?',
            next: 'explain_fracture'
          },
          {
            text:
              "I don't have time for this.",
            next: 'dismiss'
          }
        ]
      },

      explain_fracture: {
        speaker: 'Eadric the Withered',
        text: 'The Cloud. It eats memory, leaves only static. Seven clues remain.',
        choices: [{
          text: 'Seven clues?',
          next: 'clues_intro'
        }]
      },

      clues_intro: {
        speaker: 'Eadric the Withered',
        text: "Scattered across worlds. Find the relic first. It anchors what's left.",
        choices: [
          {
            text: 'Where is the relic?',
            next: 'relic_hint',
            effects: [{
              type: 'startQuest',
              questId: 'lost_relic'
            }]
          }
        ]
      },

      relic_hint: {
        speaker: 'Eadric the Withered',
        text: 'In the marsh, where the river forgets which way is down.',
        choices: [{
          text: "I'll find it.",
          next: 'end'
        }]
      },

      dismiss: {
        speaker: 'Eadric the Withered',
        text: 'Then the static will take you too. It always does.',
        choices: [{
          text: 'Leave',
          next: 'end'
        }]
      },

      still_looking: {
        speaker: 'Eadric the Withered',
        text: 'Still searching? The marsh keeps its secrets close.',
        choices: [
          {
            text: 'I have the relic.',
            next: 'relic_returned',
            condition: {
              type: 'hasItem',
              itemId: 'lost_relic'
            },
            effects: [{
              type: 'setQuestStage',
              questId: 'lost_relic',
              stage: 'relic_found'
            }]
          },
          {
            text: 'Still looking.',
            next: 'end'
          }
        ]
      },

      relic_returned: {
        speaker: 'Eadric the Withered',
        text: 'You found it. The static dims, if only a little. My thanks.',
        choices: [
          {
            text: 'Farewell.',
            next: 'end',
            effects: [{
              type: 'completeQuest',
              questId: 'lost_relic'
            }]
          }
        ]
      },

      end: { text: '…', choices: [] }
    }
  },

  wulfstan_wanderer: {
    id: 'wulfstan_wanderer',
    startNode: 'greeting',
    nodes: {
      greeting: {
        speaker: 'Wulfstan the Wanderer',
        text: 'Have you seen it? The grey nothing that swallows a world whole, then moves on to the next.',
        choices: [
          {
            text: 'What do you mean?',
            next: 'explain'
          },
          {
            text: 'I have not the time.',
            next: 'end'
          }
        ]
      },
      explain: {
        speaker: 'Wulfstan the Wanderer',
        text: 'Some call it the Cloud. I call it a warning. Best not to linger where it settles.',
        choices: [{
          text: 'Noted.',
          next: 'end'
        }]
      },
      end: {
        text: '…',
        choices: []
      }
    }
  },

  mildburg_forager: {
    id: 'mildburg_forager',
    startNode: 'greeting',
    nodes: {
      greeting: {
        speaker: 'Mildburg the Forager',
        text: 'Watch the treeline in the hills, traveller. The boars there are not what they used to be.',
        choices: [
          {
            text: 'What do you mean by that?',
            next: 'explain'
          },
          {
            text: 'I can handle a boar.',
            next: 'end'
          }
        ]
      },
      explain: {
        speaker: 'Mildburg the Forager',
        text: "They watch longer than beasts should. But their meat still fills a belly, and a belly's a belly.",
        choices: [{
          text: 'Fair enough.',
          next: 'end'
        }]
      },
      end: {
        text: '…',
        choices: []
      }
    }
  },

  cenric_the_wary: {
    id: 'cenric_the_wary',
    startNode: 'greeting',
    nodes: {
      greeting: {
        speaker: 'Cenric the Wary',
        text: 'Stay clear of the walled mountains stranger, with but one way in.',
        choices: [
          {
            text: 'Why, what is there?',
            next: 'explain'
          },
          {
            text: 'I fear nothing.',
            next: 'brave'
          }
        ]
      },
      explain: {
        speaker: 'Cenric the Wary',
        text: "I don't rightly know. Something still lives there, I think. I've not gone back to find out.",
        choices: [{
          text: "I'll be careful.",
          next: 'end'
        }]
      },
      brave: {
        speaker: 'Cenric the Wary',
        text: 'So did the last one who said that.',
        choices: [{
          text: 'Leave',
          next: 'end'
        }]
      },
      end: {
        text: '…',
        choices: []
      }
    }
  },

  eadgyth_traveller: {
    id: 'eadgyth_traveller',
    startNode: 'greeting',
    nodes: {
      greeting: {
        speaker: 'Eadgyth the Traveller',
        text: 'Step through enough of those gates and you forget which world you started in.',
        choices: [
          {
            text: 'Does it matter?',
            next: 'explain'
          },
          {
            text: 'I keep count.',
            next: 'confident'
          }
        ]
      },
      explain: {
        speaker: 'Eadgyth the Traveller',
        text: "Perhaps not. They all forget us the same, in the end. But it's a lonely thing to lose your own beginning.",
        choices: [{
          text: '…',
          next: 'end'
        }]
      },
      confident: {
        speaker: 'Eadgyth the Traveller',
        text: "Good. Hold onto that. It matters more than you'd think, out here.",
        choices: [{
          text: 'Farewell.',
          next: 'end'
        }]
      },
      end: {
        text: '…',
        choices: []
      }
    }
  }
}