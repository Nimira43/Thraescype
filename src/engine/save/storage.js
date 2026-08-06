const SAVE_KEY = 'thraescype_save_v1'
const SAVE_VERSION = 2

export function saveGame(state) {
  localStorage.setItem(SAVE_KEY, JSON.stringify({ version: SAVE_VERSION, data: state }))
}

export function loadGame() {
  const raw = localStorage.getItem(SAVE_KEY)
  if (!raw) return null

  try {
    const parsed = JSON.parse(raw)
    if (parsed.version !== SAVE_VERSION) return null
    return parsed.data
  } catch {
    return null
  }
}

export function clearGame() {
  localStorage.removeItem(SAVE_KEY)
}