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

    entryPoints: [
      {
        condition: {
          type: 'and',
          conditions: [
            { type: 'questActive', questId: 'clue_b_friend' },
            { type: 'not', condition: { type: 'flag', key: 'clue_b_cenric_found' } }
          ]
        },
        node: 'found_by_eanflaed'
      }
    ],

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
      found_by_eanflaed: {
        speaker: 'Cenric the Wary',
        text: "You've been sent looking for me, I take it. Tell Eanflaed I'm still breathing — just needed the quiet.",
        choices: [
          {
            text: 'I will.',
            next: 'end',
            effects: [{ type: 'setFlag', key: 'clue_b_cenric_found' }]
          }
        ]
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
          { text: 'Is that true?', next: 'explain', effects: [{ type: 'setFlag', key: 'heard_raevanna_ealdred' }] },
          { text: "I don't believe old wives' tales.", next: 'dismiss', effects: [{ type: 'setFlag', key: 'heard_raevanna_ealdred' }] }
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
  },

  osric_watchman: {
    id: 'osric_watchman',
    startNode: 'greeting',
    entryPoints: [
      { condition: { type: 'flag', key: 'clue_a_found' }, node: 'after_found' },
      { condition: { type: 'questActive', questId: 'clue_a_stele' }, node: 'reminder' }
    ],
    nodes: {
      greeting: {
        speaker: 'Osric the Watchman',
        text: "There's a stele out there, somewhere in these worlds. Marked stone, strange lines cut deep. I've seen it myself, once.",
        choices: [
          { text: 'Tell me more.', next: 'offer' },
          { text: 'Not interested.', next: 'dismiss' }
        ]
      },
      offer: {
        speaker: 'Osric the Watchman',
        text: "I don't know what the marks mean. Nobody does, far as I've heard. But something cut them, and something meant them.",
        choices: [
          {
            text: 'I will look for it.',
            next: 'end',
            effects: [{ type: 'startQuest', questId: 'clue_a_stele' }]
          }
        ]
      },
      dismiss: {
        speaker: 'Osric the Watchman',
        text: "Suit yourself. It'll still be standing whenever you change your mind.",
        choices: [{ text: 'Leave', next: 'end' }]
      },
      reminder: {
        speaker: 'Osric the Watchman',
        text: 'Have you found the stele yet? Somewhere out there, marked stone, waiting.',
        choices: [{ text: 'Still looking.', next: 'end' }]
      },
      after_found: {
        speaker: 'Osric the Watchman',
        text: 'You found it, then. What did you make of the marks?',
        choices: [{ text: 'Nothing certain.', next: 'end' }]
      },
      end: { text: '…', choices: [] }
    }
  },

  stele_encounter: {
    id: 'stele_encounter',
    startNode: 'uninformed',
    entryPoints: [
      { condition: { type: 'flag', key: 'clue_a_found' }, node: 'already_studied' },
      { condition: { type: 'questActive', questId: 'clue_a_stele' }, node: 'examine' }
    ],
    nodes: {
      uninformed: {
        text: "Faded lines cut deep into weathered stone. Meaningless, to eyes that don't know to look.",
        choices: [{ text: 'Leave', next: 'end' }]
      },
      examine: {
        text: 'The stele. Osric spoke true — the marks are real. You trace them, though their meaning stays just out of reach.',
        choices: [
          {
            text: 'Study it closely.',
            next: 'end',
            effects: [
              { type: 'setFlag', key: 'clue_a_found' },
              { type: 'completeQuest', questId: 'clue_a_stele' }
            ]
          }
        ]
      },
      already_studied: {
        text: 'The stele stands as before, its marks unchanged since last you looked.',
        choices: [{ text: 'Leave', next: 'end' }]
      },
      end: { text: '…', choices: [] }
    }
  },

  eanflaed_friend: {
    id: 'eanflaed_friend',
    startNode: 'greeting',
    entryPoints: [
      {
        condition: {
          type: 'and',
          conditions: [
            { type: 'flag', key: 'clue_b_cenric_found' },
            { type: 'not', condition: { type: 'flag', key: 'clue_b_rewarded' } }
          ]
        },
        node: 'reward'
      },
      { condition: { type: 'flag', key: 'clue_b_rewarded' }, node: 'thanks_done' },
      { condition: { type: 'questActive', questId: 'clue_b_friend' }, node: 'reminder' }
    ],
    nodes: {
      greeting: {
        speaker: 'Eanflaed',
        text: "Have you seen a man out here? Wary sort, doesn't talk much unless spoken to first. My friend. I fear something's happened to him.",
        choices: [
          {
            text: 'I will look for him.',
            next: 'end',
            effects: [{ type: 'startQuest', questId: 'clue_b_friend' }]
          },
          { text: 'Not my concern.', next: 'dismiss' }
        ]
      },
      dismiss: {
        speaker: 'Eanflaed',
        text: "Please. If you change your mind.",
        choices: [{ text: 'Leave', next: 'end' }]
      },
      reminder: {
        speaker: 'Eanflaed',
        text: 'Any sign of him? Wary, keeps to quiet corners. Please, if you find him...',
        choices: [{ text: 'Still looking.', next: 'end' }]
      },
      reward: {
        speaker: 'Eanflaed',
        text: "You found him — truly? Thank you. I can't tell you what that means. Here, please, take this — it's not much, but it's yours.",
        choices: [
          {
            text: 'Glad to help.',
            next: 'end',
            effects: [
              { type: 'giveItem', itemId: 'wooden_stick' },
              { type: 'setFlag', key: 'clue_b_rewarded' },
              { type: 'completeQuest', questId: 'clue_b_friend' }
            ]
          }
        ]
      },
      thanks_done: {
        speaker: 'Eanflaed',
        text: 'Thank you again, traveller. I owe you more than that stick was worth.',
        choices: [{ text: 'Farewell.', next: 'end' }]
      },
      end: { text: '…', choices: [] }
    }
  },

  oswald_mad: {
    id: 'oswald_mad',
    startNode: 'greeting',
    entryPoints: [
      { condition: { type: 'flag', key: 'clue_c_found' }, node: 'vindicated' },
      { condition: { type: 'questActive', questId: 'clue_c_plant' }, node: 'reminder' }
    ],
    nodes: {
      greeting: {
        speaker: 'Oswald',
        text: "You! Yes, you! Listen — there's a plant, up in the hills, that once gave men everlasting youth. Eat it, survive the poison, and you'll never age a day more!",
        choices: [
          { text: 'That sounds mad.', next: 'mad_response' },
          {
            text: "I'll find it.",
            next: 'end',
            effects: [{ type: 'startQuest', questId: 'clue_c_plant' }]
          }
        ]
      },
      mad_response: {
        speaker: 'Oswald',
        text: "Mad? MAD? I've seen it grow with my own eyes! Once. Maybe twice. Find it, and you'll see I'm not so mad after all.",
        choices: [
          {
            text: '...Fine, I will look.',
            next: 'end',
            effects: [{ type: 'startQuest', questId: 'clue_c_plant' }]
          }
        ]
      },
      reminder: {
        speaker: 'Oswald',
        text: 'Well? Have you found it yet? The hills, I said! The HILLS!',
        choices: [{ text: 'Still looking.', next: 'end' }]
      },
      vindicated: {
        speaker: 'Oswald',
        text: "You found it, didn't you? I TOLD you I wasn't mad! ...wasn't I right?",
        choices: [{ text: 'You were right, Oswald.', next: 'end' }]
      },
      end: { text: '…', choices: [] }
    }
  },

  ordlaf_silent: {
    id: 'ordlaf_silent',
    startNode: 'greeting',
    nodes: {
      greeting: {
        speaker: 'Ordlaf the Silent',
        text: "There's a woman up in the peaks who was there before the fracture. Older than the Empire itself, they say.",
        choices: [
          { text: 'You believe that?', next: 'explain', effects: [{ type: 'setFlag', key: 'heard_raevanna_ordlaf' }] },
          { text: 'Everyone has a story.', next: 'dismiss', effects: [{ type: 'setFlag', key: 'heard_raevanna_ordlaf' }] }
        ]
      },
      explain: {
        speaker: 'Ordlaf the Silent',
        text: "I believe what I've seen. I've not seen her. But I've seen the mountain ring, and I've not gone closer.",
        choices: [{ text: 'Fair enough.', next: 'end' }]
      },
      dismiss: {
        speaker: 'Ordlaf the Silent',
        text: "This one's mine, for what it's worth.",
        choices: [{ text: 'Leave', next: 'end' }]
      },
      end: { text: '…', choices: [] }
    }
  },

  ceolwen_merchant: {
    id: 'ceolwen_merchant',
    startNode: 'greeting',
    nodes: {
      greeting: {
        speaker: 'Ceolwen the Merchant',
        text: "Careful near the mountain ring, traveller. The witch doesn't take kindly to visitors. Or so the survivors say — the ones who came back, anyway.",
        choices: [
          { text: 'Have you met her?', next: 'explain', effects: [{ type: 'setFlag', key: 'heard_raevanna_ceolwen' }] },
          { text: "I'll trade elsewhere, then.", next: 'dismiss', effects: [{ type: 'setFlag', key: 'heard_raevanna_ceolwen' }] }
        ]
      },
      explain: {
        speaker: 'Ceolwen the Merchant',
        text: "Me? No. I sell things, I don't go looking for trouble. But I've heard enough tales to know where not to walk.",
        choices: [{ text: 'Noted.', next: 'end' }]
      },
      dismiss: {
        speaker: 'Ceolwen the Merchant',
        text: 'Wise. Mind the mountains all the same.',
        choices: [{ text: 'Leave', next: 'end' }]
      },
      end: { text: '…', choices: [] }
    }
  },

  raevanna_witch: {
    id: 'raevanna_witch',
    startNode: 'brush_off',

    entryPoints: [
      { condition: { type: 'flag', key: 'raevanna_revealed' }, node: 'after_reveal' },
      { condition: { type: 'questActive', questId: 'raevanna_tasks' }, node: 'checking_tasks' },
      {
        condition: {
          type: 'and',
          conditions: [
            { type: 'flag', key: 'clue_a_found' },
            {
              type: 'flagCountAtLeast',
              keys: ['heard_raevanna_ealdred', 'heard_raevanna_ordlaf', 'heard_raevanna_ceolwen'],
              count: 2
            }
          ]
        },
        node: 'amused'
      }
    ],

    nodes: {
      brush_off: {
        speaker: 'Raevanna',
        text: "You've wandered far to find me, little thing. But you know nothing worth my time. Come back when you've learned to listen.",
        choices: [{ text: 'Leave', next: 'end' }]
      },

      amused: {
        speaker: 'Raevanna',
        text: "Ah — you've heard my name whispered, and found the stone that doesn't speak. Amusing. Very well, traveller. Amuse me further.",
        choices: [
          { text: 'What do you want?', next: 'tasks_offered' },
          { text: 'I have no time for games.', next: 'end' }
        ]
      },

      tasks_offered: {
        speaker: 'Raevanna',
        text: "Bring me three things: meat from the hills, herbs from the green, water clean enough to drink. Small things. I am curious whether you'll bother.",
        choices: [
          {
            text: "I'll bring them.",
            next: 'end',
            effects: [{ type: 'startQuest', questId: 'raevanna_tasks' }]
          }
        ]
      },

      checking_tasks: {
        speaker: 'Raevanna',
        text: (state) => {
          const flags = ['raevanna_meat_given', 'raevanna_herbs_given', 'raevanna_water_given']
          const count = flags.filter(f => state.flags[f]).length

          if (count >= 3) return "All three. You didn't waste my time after all. I did wonder."
          if (count === 0) return "Nothing yet? I'm not impatient. I'm ancient. There's a difference."
          return `${3 - count} thing${3 - count === 1 ? '' : 's'} still owed, by my reckoning.`
        },
        choices: [
          {
            text: 'Meat from the hills.',
            next: 'checking_tasks',
            condition: { type: 'hasItem', itemId: 'boar_meat' },
            effects: [
              { type: 'removeItem', itemId: 'boar_meat' },
              { type: 'setFlag', key: 'raevanna_meat_given' }
            ]
          },
          {
            text: 'Herbs from the green.',
            next: 'checking_tasks',
            condition: { type: 'hasItem', itemId: 'herbs' },
            effects: [
              { type: 'removeItem', itemId: 'herbs' },
              { type: 'setFlag', key: 'raevanna_herbs_given' }
            ]
          },
          {
            text: 'Water, clean enough.',
            next: 'checking_tasks',
            condition: { type: 'hasItem', itemId: 'water' },
            effects: [
              { type: 'removeItem', itemId: 'water' },
              { type: 'setFlag', key: 'raevanna_water_given' }
            ]
          },
          {
            text: 'What do you know of the Stele?',
            next: 'reveal_moment',
            condition: {
              type: 'flagCountAtLeast',
              keys: ['raevanna_meat_given', 'raevanna_herbs_given', 'raevanna_water_given'],
              count: 3
            }
          },
          { text: 'Still gathering.', next: 'end' }
        ]
      },

      reveal_moment: {
        speaker: 'Raevanna',
        text: "The Stele? [She laughs.] I don't know, little thing. I never did. Its meaning was never mine to give.",
        choices: [{ text: 'Then what do you know?', next: 'cloud_reveal' }]
      },

      cloud_reveal: {
        speaker: 'Raevanna',
        text: "The Cloud in your skies? That is no mystery to me. That is Aries — the Emperor's elder son. He tried to stop his brother before the Firia bomb fell, and for his trouble, the fracture unmade him. What's left drifts still, watching worlds it couldn't save.",
        choices: [
          {
            text: '...Aries is the Cloud?',
            next: 'end',
            effects: [
              { type: 'setFlag', key: 'raevanna_revealed' },
              { type: 'setFlag', key: 'cloud_is_aries' },
              { type: 'completeQuest', questId: 'raevanna_tasks' }
            ]
          }
        ]
      },

      after_reveal: {
        speaker: 'Raevanna',
        text: 'Still wandering, little thing? The Cloud still drifts, whatever comfort that revelation gave you.',
        choices: [{ text: 'Farewell.', next: 'end' }]
      },

      end: { text: '…', choices: [] }
    }
  }
}