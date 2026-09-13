export const RECIPES = [
  {
    requires: ['wooden_codex', 'piece_of_metal'],
    keep: ['piece_of_metal'],
    result: 'vellum_parchment',
    narrative: "You turn the dials on the codex, twisting each ring until it mirrors the engravings on the piece of metal in your other hand. A click. Then another. The wood begins to smoke — not burning exactly, more like it's forgetting how to be wood at all. In moments it's gone, leaving behind a single sheet: vellum, brittle with age, marked with the same strange writing you once saw on the stele."
  },
  {
    requires: ['wood', 'sharp_metal_shard'],
    result: 'primitive_knife',
    narrative: 'You lash the sharp metal shard to the wood, binding them fast. Crude, but it holds an edge — a proper blade, of sorts.'
  },
  {
    requires: ['potato', 'boar_meat', 'water', 'herbs'],
    result: 'stew',
    narrative: 'You set the potato and meat to simmer with water and a scattering of wild herbs, until the smell alone is enough to steady you. A thick stew, finally, from whatever the worlds gave up.'
  },
  {
    requires: ['cloth', 'twine'],
    result: 'water_skin_empty',
    narrative: 'You work the cloth and twine together, binding and knotting until a crude but serviceable water skin takes shape in your hands. Empty for now — it\'ll need filling.'
  },
  {
    requires: ['cloth', 'twine', 'sharp_metal_shard'],
    result: 'bag',
    narrative: "You bind the cloth tight with the twine, working a sliver of metal into the seam to hold its shape. Rough, but it'll carry more than your arms alone ever could."
  }
]

export function findRecipe(selectedIds) {
  const sortedSelected = [...selectedIds].sort()

  return RECIPES.find(recipe => {
    const sortedRequires = [...recipe.requires].sort()
    return (
      sortedRequires.length === sortedSelected.length &&
      sortedRequires.every((id, i) => id === sortedSelected[i])
    )
  }) || null
}