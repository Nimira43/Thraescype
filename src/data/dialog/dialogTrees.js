export const DIALOGUE_TREES = {
  old_man_intro: {
    startNode: 'greeting',
    nodes: {
      greeting: {
        text: "Ah… a traveller. You see it too, don't you? The fracture in the sky.",
        choices: [
          {
            text: "What fracture?",
            next: 'explain_fracture'
          },
          {
            text: "I don't have time for this.",
            next: 'dismiss'
          }
        ]
      },

      explain_fracture: {
        text: "The Cloud. It eats memory, leaves only static. Seven clues remain.",
        choices: [
          {
            text: "Seven clues?",
            next: 'clues_intro'
          }
        ]
      },

      clues_intro: {
        text: "Scattered across worlds. Find the relic first. It anchors what's left.",
        choices: [
          {
            text: "Where is the relic?",
            next: 'relic_hint',
            effect: { type: 'startQuest', questId: 'lost_relic' }
          }
        ]
      },

      relic_hint: {
        text: "In the marsh, where the river forgets which way is down.",
        choices: [
          {
            text: "I'll find it.",
            next: 'end'
          }
        ]
      },

      dismiss: {
        text: "Then the static will take you too. It always does.",
        choices: [
          { text: "Leave", next: 'end' }
        ]
      },

      end: {
        text: "…",
        choices: []
      }
    }
  }
}
