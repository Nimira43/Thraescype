export const DIALOGUE_TREES = {
  eadric_heirlooms: {
    id: 'eadric_heirlooms',
    startNode: 'greeting',

    entryPoints: [
      {
        condition: { type: 'questActive', questId: 'eadric_heirlooms' },
        node: 'checking_progress'
      }
    ],

    nodes: {
      greeting: {
        speaker: 'Eadric the Withered',
        text: "Ah, a traveller. Forgive an old man's clutter — I've lost pieces of my family scattered further than my legs can carry me now.",
        choices: [
          { text: 'What have you lost?', next: 'explain' },
          { text: 'Not my concern.', next: 'dismiss' }
        ]
      },

      explain: {
        speaker: 'Eadric the Withered',
        text: 'Three keepsakes: a carved stone, a tarnished locket, and a cracked old pipe. Nothing grand. Just... mine.',
        choices: [
          {
            text: "I'll look for them.",
            next: 'end',
            effects: [{ type: 'startQuest', questId: 'eadric_heirlooms' }]
          }
        ]
      },

      dismiss: {
        speaker: 'Eadric the Withered',
        text: "No matter. They're only things, in the end.",
        choices: [{ text: 'Leave', next: 'end' }]
      },

      checking_progress: {
        speaker: 'Eadric the Withered',
        text: (state) => {
          const flags = ['eadric_returned_relic', 'eadric_returned_locket', 'eadric_returned_pipe']
          const count = flags.filter(f => state.flags[f]).length

          if (state.flags.eadric_book_given) {
            return 'The book is yours now. Read it well — it holds more truth than I ever managed to tell.'
          }
          if (count >= 3) {
            return "All three, back where they belong. You've done an old man a kindness he didn't expect."
          }
          if (count === 0) {
            return 'Still nothing? No matter. Take your time.'
          }
          return `${3 - count} keepsake${3 - count === 1 ? '' : 's'} left to find, by my count.`
        },
        choices: [
          {
            text: 'Here is the carved stone.',
            next: 'checking_progress',
            condition: { type: 'hasItem', itemId: 'lost_relic' },
            effects: [
              { type: 'removeItem', itemId: 'lost_relic' },
              { type: 'setFlag', key: 'eadric_returned_relic' }
            ]
          },
          {
            text: 'Here is the locket.',
            next: 'checking_progress',
            condition: { type: 'hasItem', itemId: 'eadric_locket' },
            effects: [
              { type: 'removeItem', itemId: 'eadric_locket' },
              { type: 'setFlag', key: 'eadric_returned_locket' }
            ]
          },
          {
            text: 'Here is the pipe.',
            next: 'checking_progress',
            condition: { type: 'hasItem', itemId: 'eadric_pipe' },
            effects: [
              { type: 'removeItem', itemId: 'eadric_pipe' },
              { type: 'setFlag', key: 'eadric_returned_pipe' }
            ]
          },
          {
            text: 'Thank you, Eadric.',
            next: 'end',
            condition: {
              type: 'and',
              conditions: [
                {
                  type: 'flagCountAtLeast',
                  keys: ['eadric_returned_relic', 'eadric_returned_locket', 'eadric_returned_pipe'],
                  count: 3
                },
                { type: 'not', condition: { type: 'flag', key: 'eadric_book_given' } }
              ]
            },
            effects: [
              { type: 'giveItem', itemId: 'old_book' },
              { type: 'setFlag', key: 'eadric_book_given' },
              { type: 'completeQuest', questId: 'eadric_heirlooms' }
            ]
          },
          { text: 'Still searching.', next: 'end' }
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
          { text: 'What do you mean?', next: 'explain' },
          { text: 'I have not the time.', next: 'end' }
        ]
      },
      explain: {
        speaker: 'Wulfstan the Wanderer',
        text: 'Some call it the Cloud. I call it a warning. Best not to linger where it settles.',
        choices: [{ text: 'Noted.', next: 'end' }]
      },
      end: { text: '…', choices: [] }
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
          { text: 'What do you mean by that?', next: 'explain' },
          { text: 'I can handle a boar.', next: 'end' }
        ]
      },
      explain: {
        speaker: 'Mildburg the Forager',
        text: "They watch longer than beasts should. But their meat still fills a belly, and a belly's a belly.",
        choices: [{ text: 'Fair enough.', next: 'end' }]
      },
      end: { text: '…', choices: [] }
    }
  },

  cenric_the_wary: {
    id: 'cenric_the_wary',
    startNode: 'greeting',
    nodes: {
      greeting: {
        speaker: 'Cenric the Wary',
        text: 'Stay clear of the stone rings, the ones walled in mountain with but one way in.',
        choices: [
          { text: 'Why, what is there?', next: 'explain' },
          { text: 'I fear nothing.', next: 'brave' }
        ]
      },
      explain: {
        speaker: 'Cenric the Wary',
        text: "I don't rightly know. Something still lives there, I think. I've not gone back to find out.",
        choices: [{ text: "I'll be careful.", next: 'end' }]
      },
      brave: {
        speaker: 'Cenric the Wary',
        text: 'So did the last one who said that.',
        choices: [{ text: 'Leave', next: 'end' }]
      },
      end: { text: '…', choices: [] }
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
          { text: 'Does it matter?', next: 'explain' },
          { text: 'I keep count.', next: 'confident' }
        ]
      },
      explain: {
        speaker: 'Eadgyth the Traveller',
        text: "Perhaps not. They all forget us the same, in the end. But it's a lonely thing to lose your own beginning.",
        choices: [{ text: '…', next: 'end' }]
      },
      confident: {
        speaker: 'Eadgyth the Traveller',
        text: "Good. Hold onto that. It matters more than you'd think, out here.",
        choices: [{ text: 'Farewell.', next: 'end' }]
      },
      end: { text: '…', choices: [] }
    }
  },

  ealdred_elder: {
    id: 'ealdred_elder',
    startNode: 'greeting',
    nodes: {
      greeting: {
        speaker: 'Ealdred the Elder',
        text: 'They say the witch was born a thousand years gone. Before the Empire. Before Triana. Before any of us.',
        choices: [
          { text: 'Is that true?', next: 'explain' },
          { text: "I don't believe old wives' tales.", next: 'dismiss' }
        ]
      },
      explain: {
        speaker: 'Ealdred the Elder',
        text: "True? Who can say. A thousand years is a long time to keep a story straight. But I believe it.",
        choices: [{ text: 'Hm.', next: 'end' }]
      },
      dismiss: {
        speaker: 'Ealdred the Elder',
        text: "Nor did I, once. Then I saw her lair with my own eyes, and never went back for a second look.",
        choices: [{ text: 'Leave', next: 'end' }]
      },
      end: { text: '…', choices: [] }
    }
  },

  frithuswith_chronicler: {
    id: 'frithuswith_chronicler',
    startNode: 'greeting',
    nodes: {
      greeting: {
        speaker: 'Frithuswith the Chronicler',
        text: "It was the Emperor's own son who broke the world. Arian, they called him. A general the soldiers loved, and a monster besides.",
        choices: [
          { text: 'What did he do?', next: 'explain' },
          { text: "I've heard enough of Emperors.", next: 'end' }
        ]
      },
      explain: {
        speaker: 'Frithuswith the Chronicler',
        text: "He built a weapon to end Triana's rebellion. The Firia bomb, they named it. It did more than end a rebellion — it ended Elveria whole.",
        choices: [{ text: "I'll remember that name.", next: 'end' }]
      },
      end: { text: '…', choices: [] }
    }
  },

  godwine_ironhand: {
    id: 'godwine_ironhand',
    startNode: 'greeting',
    nodes: {
      greeting: {
        speaker: 'Godwine Ironhand',
        text: 'I fought in Triana, before the end. Small missiles, they called Firia too — burned villages to ash long before the big one fell.',
        choices: [
          { text: 'You survived the Apocalypse?', next: 'explain' },
          { text: "I don't want war stories.", next: 'end' }
        ]
      },
      explain: {
        speaker: 'Godwine Ironhand',
        text: 'Barely. One day there was a country beneath my feet. The next, twenty broken worlds, and portals where the roads used to be.',
        choices: [{ text: 'Farewell.', next: 'end' }]
      },
      end: { text: '…', choices: [] }
    }
  },

  hilda_devout: {
    id: 'hilda_devout',
    startNode: 'greeting',
    nodes: {
      greeting: {
        speaker: 'Hilda the Devout',
        text: 'The Cloud is no accident, traveller. It is judgement, sent to watch what remains of us.',
        choices: [
          { text: 'Judgement for what?', next: 'explain' },
          { text: "I don't believe in omens.", next: 'dismiss' }
        ]
      },
      explain: {
        speaker: 'Hilda the Devout',
        text: "For the bomb. For the Emperor's pride. For all of it. It watches, and one day it will decide we've suffered enough — or that we haven't.",
        choices: [{
          text: "I hope you're wrong.", next: 'end' }]
      },
          dismiss: {
          speaker: 'Hilda the Devout',
          text: 'Belief was never the requirement. Only its attention.',
          choices: [{ text: 'Leave', next: 'end' }]
        },
          end: { text: '…', choices: [] }
    }
    },

    ecgbert_the_lost: {
      id: 'ecgbert_the_lost',
      startNode: 'greeting',
      nodes: {
        greeting: {
          speaker: 'Ecgbert the Lost',
          text: "One moment I was walking home. The next, this. I don't know how long I was... gone.",
          choices: [
            { text: 'Gone where?', next: 'explain' },
            { text: 'That sounds like madness.', next: 'end' }
          ]
        },
        explain: {
          speaker: 'Ecgbert the Lost',
          text: "Some kind of void, they tell me. From before the fracture. I don't remember the fall — only walking, then waking here, years later by the look of things.",
          choices: [{ text: "I'm sorry.", next: 'end' }]
        },
        end: { text: '…', choices: [] }
      }
    },

    wynflaed_wild: {
      id: 'wynflaed_wild',
      startNode: 'greeting',
      nodes: {
        greeting: {
          speaker: 'Wynflaed the Wild',
          text: "Shh. Shh! Do you hear it? The world isn't broken, traveller — it's dreaming. Twenty dreams, all dreamt by a sleeping moon.",
          choices: [
            { text: 'What are you talking about?', next: 'explain' },
            { text: "You're not right in the head.", next: 'dismiss' }
          ]
        },
        explain: {
          speaker: 'Wynflaed the Wild',
          text: "The Cloud? That's just the moon's eyelash, caught in the wind. Wave to it. It waves back, if you're patient enough.",
          choices: [{ text: "I'll... try that.", next: 'end' }]
        },
        dismiss: {
          speaker: 'Wynflaed the Wild',
          text: "None of us are, out here. At least I know it.",
          choices: [{ text: 'Leave', next: 'end' }]
        },
        end: { text: '…', choices: [] }
      }
    }
  }
