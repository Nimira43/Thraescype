export const RECIPES = [
  {
    requires: ['wooden_codex', 'piece_of_metal'],
    keep: ['piece_of_metal'],
    result: 'vellum_parchment',
    narrative: "You turn the dials on the codex, twisting each ring until it mirrors the engravings on the piece of metal in your other hand. A click. Then another. The wood begins to smoke — not burning exactly, more like it's forgetting how to be wood at all. In moments it's gone, leaving behind a single sheet: vellum, brittle with age, marked with the same strange writing you once saw on the stele."
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