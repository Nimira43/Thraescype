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
            next: 'give_book',
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
            }
          },
          { text: 'Still searching.', next: 'end' }
        ]
      },

      give_book: {
        speaker: 'Eadric the Withered',
        text: "Ah — that's the last of them, then. There's one more thing, before you go. I came across an old book once, wandering these fractured worlds. Already read it, cover to cover. No use to an old man who's already forgotten more than it can teach him. Take it, if you'd like.",
        choices: [
          {
            text: 'Thank you.',
            next: 'end',
            effects: [
              { type: 'giveItem', itemId: 'old_book' },
              { type: 'setFlag', key: 'eadric_book_given' },
              { type: 'completeQuest', questId: 'eadric_heirlooms' }
            ]
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
        choices: [{ text: "I hope you're wrong.", next: 'end' }]
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
        text: (state) => state.flags.clue_f_done
          ? "The stele's marks feel different now — quieter, somehow. As if they've already told you everything they were going to."
          : 'The stele stands as before, its marks unchanged since last you looked.',
        choices: [
          {
            text: 'Hold the vellum to the stele.',
            next: 'vellum_translation',
            condition: {
              type: 'and',
              conditions: [
                { type: 'hasItem', itemId: 'vellum_parchment' },
                { type: 'flag', key: 'clue_e_done' },
                { type: 'not', condition: { type: 'flag', key: 'clue_f_done' } }
              ]
            }
          },
          {
            text: 'Try the wooden stick.',
            next: 'stele_no_reaction',
            condition: {
              type: 'or',
              conditions: [
                { type: 'hasItem', itemId: 'wooden_stick' },
                { type: 'hasItem', itemId: 'wooden_codex' }
              ]
            }
          },
          {
            text: 'Try the everlasting plant.',
            next: 'stele_no_reaction',
            condition: { type: 'hasItem', itemId: 'everlasting_plant' }
          },
          {
            text: 'Try the piece of metal.',
            next: 'stele_no_reaction',
            condition: { type: 'hasItem', itemId: 'piece_of_metal' }
          },
          { text: 'Leave', next: 'end' }
        ]
      },

      vellum_translation: {
        text: "You hold the vellum up against the stele. The writing seems to shift, aligning with the carved marks beneath it — and then, impossibly, it translates before your eyes.\n\n'My love, if you read this then our plans have failed and I have perished. The Casting went wrong and Elveria was destroyed and fractured.\n\nArian, the arrogant fool, is slain by my hand. His bones, now rotted away, lie buried beneath your feet where you stand.\n\nSeek out the Everlasting Flower. This marks where I now rest, in the hills.\n\nMy love, it is down to you. Seek Raevanna and give her this parchment and the Everlasting Flower. She will tell you what to do with the Verisible.\n\nI grow weaker, Þræscype. Not long now.\n\nRylaine.'",
        choices: [
          {
            text: 'Þræscype...',
            next: 'end',
            effects: [{ type: 'setFlag', key: 'clue_f_done' }]
          }
        ]
      },

      stele_no_reaction: {
        text: 'Nothing happens.',
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
      {
        condition: {
          type: 'and',
          conditions: [
            { type: 'flag', key: 'thraescype_awakened' },
            { type: 'not', condition: { type: 'flag', key: 'raevanna_destroyed' } }
          ]
        },
        node: 'final_confrontation_1'
      },
      {
        condition: {
          type: 'and',
          conditions: [
            { type: 'hasItem', itemId: 'vellum_parchment' },
            { type: 'hasItem', itemId: 'everlasting_plant' },
            { type: 'hasItem', itemId: 'piece_of_metal' },
            { type: 'flag', key: 'clue_g_done' },
            { type: 'not', condition: { type: 'flag', key: 'confrontation_done' } }
          ]
        },
        node: 'confrontation_start'
      },
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
            text: 'Water, clean enough — from my skin.',
            next: 'checking_tasks',
            condition: { type: 'hasItem', itemId: 'water_skin_full' },
            effects: [
              { type: 'removeItem', itemId: 'water_skin_full' },
              { type: 'giveItem', itemId: 'water_skin_empty' },
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

      confrontation_start: {
        speaker: 'Raevanna',
        text: 'Ah! Little one, you have returned to see me. Still seeking answers?',
        choices: [
          {
            text: 'Yes, I need answers to things that I have found out. Firstly — what can you tell me about this?',
            next: 'reads_vellum'
          }
        ]
      },

      reads_vellum: {
        speaker: 'Raevanna',
        text: '[She takes the vellum and reads it. Her breath catches — shock, and something like wonder.] Amazing. I... I never thought this day would come. Þræscype?',
        choices: [{ text: 'I keep hearing that name. What has this got to do with me?', next: 'void_emergence' }]
      },

      void_emergence: {
        speaker: 'Raevanna',
        text: "Many years ago, Rylaine and Arian came forth from the Void, just as you did. Though tired and confused, their wits were very much intact. Rylaine was angered that you hadn't emerged from the Void as well. She confronted Arian with the truth — that she loved you, and that she despised him. She told him that both of you had planned to rid Elveria of the Empire, and planned to rule together. She killed Arian, but was badly injured. The Cloud — Aries — was drawn to the battle, and attacked Rylaine with a burst of lightning. She managed to evade him, and sought sanctuary within my valley.",
        choices: [{ text: 'Am I Þræscype?', next: 'confirm_identity' }]
      },

      confirm_identity: {
        speaker: 'Raevanna',
        text: 'Yes, little one.',
        choices: [{ text: 'And Rylaine?', next: 'rylaine_fate' }]
      },

      rylaine_fate: {
        speaker: 'Raevanna',
        text: 'She was worried that were you to come from the Void, then the Cloud would attack you. She was badly injured, and spent her remaining days laying down clues throughout the Fractured Worlds — clues to help you fight against Aries. He has, ironically, grown strong now in the ways of Alchemy.',
        choices: [{ text: "I have spoken to Aries. He doesn't know me.", next: 'shield_explained' }]
      },

      shield_explained: {
        speaker: 'Raevanna',
        text: 'That is down to Rylaine. Before the Apocalypse, and afterwards. You meant a great deal to her. She used her magic to shield you.',
        choices: [{ text: 'That would work after the Apocalypse?', next: 'shield_confirmed' }]
      },

      shield_confirmed: {
        speaker: 'Raevanna',
        text: 'Evidently so — though I fear Aries will find out the truth soon.',
        choices: [
          {
            text: 'This is the Everlasting Flower that Rylaine mentioned. And this — is this the Verisible she spoke of?',
            next: 'plant_presented'
          }
        ]
      },

      plant_presented: {
        speaker: 'Raevanna',
        text: 'You found the plant as well. You are prepared, Þræscype.',
        choices: [{ text: 'Someone told me the flower gives everlasting life?', next: 'fool_dismissed' }]
      },

      fool_dismissed: {
        speaker: 'Raevanna',
        text: 'Hmm. Some fool in the wilderness?',
        choices: [{ text: 'Yes, I guess.', next: 'flower_explained' }]
      },

      flower_explained: {
        speaker: 'Raevanna',
        text: 'The Everlasting Flower is a vessel, Þræscype. A vessel that holds the power that was part of Rylaine — power she wanted you to have with her death. To gain that power? Yes, you will need to eat the flower. But will it make you immortal? No.',
        choices: [{ text: 'And the Verisible?', next: 'verisible_explained' }]
      },

      verisible_explained: {
        speaker: 'Raevanna',
        text: 'I know little of what that is, Þræscype. All I know is that it is a concentrator of Alchemical power. It draws power from different sources and channels it. Rylaine said that you would know how to use the Verisible to channel your power, and hers, when the time came.',
        choices: [
          {
            text: "To confront and destroy Aries? The only other outcome would be him wanting to destroy me? I don't understand, and I don't want this.",
            next: 'final_choice'
          }
        ]
      },

      final_choice: {
        speaker: 'Raevanna',
        text: "Indeed. If you just want to continue on with your current existence then don't eat the flower. Be rid of the Verisible. But Þræscype — by eating the flower, I am certain that the questions you still have will be answered.",
        choices: [
          {
            text: 'I understand.',
            next: 'end',
            effects: [{ type: 'setFlag', key: 'confrontation_done' }]
          }
        ]
      },

      final_confrontation_1: {
        speaker: 'Raevanna',
        text: 'So — how do you feel? Do you remember?',
        choices: [{ text: 'Yes. I remember. I feel whole.', next: 'final_confrontation_2' }]
      },

      final_confrontation_2: {
        speaker: 'Raevanna',
        text: "Then Rylaine's sacrifice was not in vain.",
        choices: [
          {
            text: 'So, Witch, you gave aid to Rylaine — to help her protect me for when I returned?',
            next: 'final_confrontation_3'
          }
        ]
      },

      final_confrontation_3: {
        speaker: 'Raevanna',
        text: 'Witch?',
        choices: [{ text: 'That is what you are, is that not so?', next: 'final_confrontation_4' }]
      },

      final_confrontation_4: {
        speaker: 'Raevanna',
        text: 'My name is Raevanna, and you shall address me as so.',
        choices: [{ text: 'I am grateful.', next: 'final_confrontation_5' }]
      },

      final_confrontation_5: {
        speaker: 'Raevanna',
        text: "[You raise your arm, the Verisible held tight in your grasp. Raevanna's eyes narrow.] You have a strange way of showing gratitude.",
        choices: [
          {
            text: 'You have done well, Witch. I am whole. But there is still one more thing you can do for me.',
            next: 'final_confrontation_6'
          }
        ]
      },

      final_confrontation_6: {
        speaker: 'Raevanna',
        text: 'Never! Let me go and then begone! Leave my valley!',
        choices: [
          {
            text: "I need to test the powers that I have. I wouldn't want to face Aries without knowing for sure how strong I've become.",
            next: 'attack_prompt'
          }
        ]
      },

      attack_prompt: {
        text: 'The Verisible glows faintly in your grasp, humming with barely-contained power.',
        choices: [
          {
            text: 'Attack Raevanna',
            next: 'raevanna_death',
            effects: [{ type: 'setFlag', key: 'raevanna_destroyed' }]
          }
        ]
      },

      raevanna_death: {
        text: "From the Verisible, a beam of golden light strikes Raevanna and envelops her whole.\n\nThe golden glow intensifies. Raevanna's flesh bubbles, then blackens. Her screams reverberate around the valley. As the golden glow turns to blinding white light, her screams stop.\n\nThe white light fades, leaving a charred, blackened figure standing there. You lower the Verisible, watching. The black figure disintegrates before your eyes.\n\nYou turn and walk away.",
        choices: [{ text: 'Leave', next: 'end' }]
      },

      end: { text: '…', choices: [] }
    }
  },

  cloud_encounter: {
    id: 'cloud_encounter',
    startNode: 'approach',
    entryPoints: [
      { condition: { type: 'flag', key: 'clue_e_done' }, node: 'clue_e_revisit' },
      {
        condition: {
          type: 'and',
          conditions: [
            { type: 'flag', key: 'heard_thraescype' },
            { type: 'not', condition: { type: 'flag', key: 'clue_e_done' } }
          ]
        },
        node: 'clue_e_1'
      },
      { condition: { type: 'flag', key: 'cloud_first_encounter_done' }, node: 'revisit' }
    ],
    nodes: {
      approach: {
        text: "The Cloud hangs close, static crackling faintly at its edge. It doesn't retreat.",
        choices: [
          { text: 'Are you Aries?', next: 'how_do_you_know' },
          { text: 'Leave it be.', next: 'end' }
        ]
      },
      how_do_you_know: {
        speaker: 'The Cloud',
        text: 'How do you know that name?',
        choices: [{ text: 'Raevanna told me.', next: 'knows_raevanna' }]
      },
      knows_raevanna: {
        speaker: 'The Cloud',
        text: 'Raevanna. Yes — I know her. She was there, same as I. Then you know what I am, if she named me true.',
        choices: [{ text: 'What are you watching for?', next: 'watching_for' }]
      },
      watching_for: {
        speaker: 'The Cloud',
        text: "Arian is dead — I saw it happen, though not by my hand. Rylaine evaded me that day; I don't know if she still lives. If she returns, or any other Alchemist, I will know them.",
        choices: [{ text: 'What will you do, when they do?', next: 'unanswered' }]
      },
      unanswered: {
        speaker: 'The Cloud',
        text: 'The Cloud does not answer. Not yet.',
        choices: [
          {
            text: 'Leave',
            next: 'end',
            effects: [{ type: 'setFlag', key: 'cloud_first_encounter_done' }]
          }
        ]
      },
      revisit: {
        speaker: 'The Cloud',
        text: 'It watches still. It has not answered your question. Perhaps it cannot, yet.',
        choices: [{ text: 'Leave', next: 'end' }]
      },

      clue_e_1: {
        speaker: 'The Cloud',
        text: 'I sense something in you, but I do not know you. You are not an Alchemist — this is for sure. I would know this. But. Who are you?',
        choices: [
          { text: 'I am searching for those answers, Aries. You were against the Alchemists, were you not?', next: 'clue_e_2' }
        ]
      },
      clue_e_2: {
        speaker: 'The Cloud',
        text: 'I was against what my brother did with their power.',
        choices: [{ text: 'And what are you doing now?', next: 'clue_e_3' }]
      },
      clue_e_3: {
        speaker: 'The Cloud',
        text: 'I am waiting. For Rylaine. Arian is dead — that much I know for certain. I saw it happen, though it was not by my hand.',
        choices: [{ text: 'What will you do if you see her again?', next: 'clue_e_4' }]
      },
      clue_e_4: {
        speaker: 'The Cloud',
        text: "I will strike her down with the power I've been harvesting these past many years.",
        choices: [{ text: 'Power?', next: 'clue_e_5' }]
      },
      clue_e_5: {
        speaker: 'The Cloud',
        text: 'I feel it within me. Ironic that I would gain Alchemical powers after the Apocalypse.',
        choices: [{ text: 'How do you know these powers are Alchemical?', next: 'clue_e_6' }]
      },
      clue_e_6: {
        speaker: 'The Cloud',
        text: 'How else would I survive?',
        choices: [{ text: 'Hmm, okay. Who is Rylaine?', next: 'clue_e_7' }]
      },
      clue_e_7: {
        speaker: 'The Cloud',
        text: 'Rylaine was a powerful Alchemist. She seduced Arian, corrupting him and poisoning his mind. Together they wanted complete dominance. They went too far. They destroyed Elveria.',
        choices: [{ text: 'Which are now The Fractured Worlds?', next: 'clue_e_8' }]
      },
      clue_e_8: {
        speaker: 'The Cloud',
        text: 'Precisely.',
        choices: [{ text: 'And so you wait for her? To finish her off.', next: 'clue_e_9' }]
      },
      clue_e_9: {
        speaker: 'The Cloud',
        text: 'If she emerges from the Void, I will finish her.',
        choices: [{ text: 'What if she is dead already? During the Apocalypse?', next: 'clue_e_10' }]
      },
      clue_e_10: {
        speaker: 'The Cloud',
        text: 'Then I shall continue as I am into eternity.',
        choices: [{ text: "That'll be a long time.", next: 'clue_e_11' }]
      },
      clue_e_11: {
        speaker: 'The Cloud',
        text: "For sure. Now stranger, I must go. Go and try to find yourself. But be careful finding your answers. I'm watching you.",
        choices: [
          {
            text: 'Farewell.',
            next: 'end',
            effects: [{ type: 'setFlag', key: 'clue_e_done' }]
          }
        ]
      },
      clue_e_revisit: {
        speaker: 'The Cloud',
        text: 'It watches still. It has told you what it knows, for now.',
        choices: [{ text: 'Leave', next: 'end' }]
      },

      end: { text: '…', choices: [] }
    }
  },

  aethelflaed_storyteller: {
    id: 'aethelflaed_storyteller',
    startNode: 'greeting',
    entryPoints: [
      { condition: { type: 'hasItem', itemId: 'old_book' }, node: 'notices_book' }
    ],
    nodes: {
      greeting: {
        speaker: 'Aethelflaed',
        text: 'Stories, traveller — do you know any? I collect them, the way some collect coins.',
        choices: [
          { text: 'I have none worth telling.', next: 'end' },
          { text: 'Perhaps another time.', next: 'end' }
        ]
      },
      notices_book: {
        speaker: 'Aethelflaed',
        text: 'Is that a book you carry? I love stories — would you read to me?',
        choices: [
          { text: 'Of course.', next: 'family_story' },
          { text: 'Not now.', next: 'end' }
        ]
      },
      family_story: {
        speaker: 'Aethelflaed',
        text: 'My father told me once that our family descends from one of the mages of the Alchemists. He said they sought something called Þræscype.',
        choices: [{ text: 'What is Þræscype?', next: 'unknown' }]
      },
      unknown: {
        speaker: 'Aethelflaed',
        text: "I don't know. Treasure, maybe? He never said, and I never asked enough before he was gone.",
        choices: [
          {
            text: '…',
            next: 'end',
            effects: [{ type: 'setFlag', key: 'heard_thraescype' }]
          }
        ]
      },
      end: { text: '…', choices: [] }
    }
  },

  cuthbert_confused: {
    id: 'cuthbert_confused',
    startNode: 'greeting',
    nodes: {
      greeting: {
        speaker: 'Cuthbert the Confused',
        text: 'I found a door once, in the water. Swore it. Went under, came back with an armful of nothing.',
        choices: [
          { text: 'A door in the water?', next: 'explain' },
          { text: 'That sounds unlikely.', next: 'dismiss' }
        ]
      },
      explain: {
        speaker: 'Cuthbert the Confused',
        text: 'Aye. Or maybe it was a fish. Big fish. Silver as a coin. I get the two confused, these days.',
        choices: [{ text: 'Right...', next: 'end' }]
      },
      dismiss: {
        speaker: 'Cuthbert the Confused',
        text: "Unlikely's not the same as untrue.",
        choices: [{ text: 'Leave', next: 'end' }]
      },
      end: { text: '…', choices: [] }
    }
  },

  edith_grieving: {
    id: 'edith_grieving',
    startNode: 'greeting',
    nodes: {
      greeting: {
        speaker: 'Edith the Grieving',
        text: 'I had a sister, once. Before. I don\'t know which world she\'s in now, or if she\'s in any of them at all.',
        choices: [
          { text: "I'm sorry.", next: 'explain' },
          { text: "I don't know what to say.", next: 'dismiss' }
        ]
      },
      explain: {
        speaker: 'Edith the Grieving',
        text: "Nothing to be sorry for. You didn't break the sky. I just... talk about her, sometimes. Keeps the shape of her from fading.",
        choices: [{ text: "That's not nothing.", next: 'end' }]
      },
      dismiss: {
        speaker: 'Edith the Grieving',
        text: "Nobody does. That's alright too.",
        choices: [{ text: 'Leave', next: 'end' }]
      },
      end: { text: '…', choices: [] }
    }
  },

  godric_watchful: {
    id: 'godric_watchful',
    startNode: 'greeting',
    nodes: {
      greeting: {
        speaker: 'Godric the Watchful',
        text: 'Twenty worlds, and no two portals ever look quite the same. Have you noticed that?',
        choices: [
          { text: 'What do you mean?', next: 'explain' },
          { text: "Can't say I have.", next: 'dismiss' }
        ]
      },
      explain: {
        speaker: 'Godric the Watchful',
        text: "Rings, mostly. But some flicker, some hum, some just... wait. Like they remember being something else, once.",
        choices: [{ text: 'Interesting.', next: 'end' }]
      },
      dismiss: {
        speaker: 'Godric the Watchful',
        text: "Start looking. You'll see it.",
        choices: [{ text: 'Leave', next: 'end' }]
      },
      end: { text: '…', choices: [] }
    }
  },

  cyneburg_restless: {
    id: 'cyneburg_restless',
    startNode: 'greeting',
    nodes: {
      greeting: {
        speaker: 'Cyneburg the Restless',
        text: "Doesn't it frighten you? Twenty worlds, and not one of them whole.",
        choices: [
          { text: 'Sometimes.', next: 'explain' },
          { text: "I've stopped letting it.", next: 'dismiss' }
        ]
      },
      explain: {
        speaker: 'Cyneburg the Restless',
        text: "I haven't managed that. Every portal I step through, some part of me expects it to be the last one. That there won't be a next world waiting.",
        choices: [{ text: 'There always has been, so far.', next: 'end' }]
      },
      dismiss: {
        speaker: 'Cyneburg the Restless',
        text: 'Teach me how, if you ever work it out.',
        choices: [{ text: 'Leave', next: 'end' }]
      },
      end: { text: '…', choices: [] }
    }
  },

  leofric_dreamer: {
    id: 'leofric_dreamer',
    startNode: 'greeting',
    nodes: {
      greeting: {
        speaker: 'Leofric the Dreamer',
        text: 'I dreamt the sky was made of paper last night. Woke up and checked. Very disappointing.',
        choices: [
          { text: 'You checked?', next: 'explain' },
          { text: 'You dream strange things.', next: 'dismiss' }
        ]
      },
      explain: {
        speaker: 'Leofric the Dreamer',
        text: "Course I checked. Can't trust a sky that's never once told you what it's made of. Still hasn't, mind.",
        choices: [{ text: 'Fair point, somehow.', next: 'end' }]
      },
      dismiss: {
        speaker: 'Leofric the Dreamer',
        text: "Everyone does, out here. Yours just haven't caught up yet.",
        choices: [{ text: 'Leave', next: 'end' }]
      },
      end: { text: '…', choices: [] }
    }
  },

  wulfhild_quiet: {
    id: 'wulfhild_quiet',
    startNode: 'greeting',
    nodes: {
      greeting: {
        speaker: 'Wulfhild the Quiet',
        text: 'The forests remember more than the plains do. You can feel it, if you stand still long enough.',
        choices: [
          { text: 'Remember what?', next: 'explain' },
          { text: "I don't feel anything.", next: 'dismiss' }
        ]
      },
      explain: {
        speaker: 'Wulfhild the Quiet',
        text: 'What was here, before. Plains forget easy — nothing to hold the shape of a thing. Forests hold on longer.',
        choices: [{ text: "I'll stand still, next forest I find.", next: 'end' }]
      },
      dismiss: {
        speaker: 'Wulfhild the Quiet',
        text: 'Not yet, maybe. Give it time.',
        choices: [{ text: 'Leave', next: 'end' }]
      },
      end: { text: '…', choices: [] }
    }
  }
}