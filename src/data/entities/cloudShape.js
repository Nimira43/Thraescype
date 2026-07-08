const CLOUD_ART = [
  '    xxxxxxx',
  ' xxxxxxxxxxxxxxx',
  '  xxxxxxxxxxxx',
  ' xxxxxxxxxxxxxx',
  '   xxxxxxx'
]

function parseShape(art) {
  const offsets = []

  art.forEach((line, dy) => {
    for (let dx = 0; dx < line.length; dx++) {
      if (line[dx] === 'x') offsets.push({ dx, dy })
    }
  })

  const width = Math.max(...offsets.map(o => o.dx)) + 1
  const height = art.length

  return { offsets, width, height }
}

export const CLOUD_SHAPE = parseShape(CLOUD_ART)