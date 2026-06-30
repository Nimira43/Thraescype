const SAVE_KEY = 'thraescype_save_v1'

export function saveGame(state) {
  localStorage.setItem(SAVE_KEY, JSON.stringify(state))
}

export function loadGame() {
  const raw = localStorage.getItem(SAVE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function clearGame() {
  localStorage.removeItem(SAVE_KEY)
}

