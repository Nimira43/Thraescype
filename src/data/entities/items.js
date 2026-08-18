export const ITEMS = {

  lost_relic: {
    name: 'Ancient Relic',
    category: 'relic',
    weight: 1,
    questItem: true,
    description: 'A carved stone, warm to the touch.'
  },

  piece_of_metal: {
    name: 'A Piece of Metal',
    category: 'relic',
    weight: 1,
    description: 'A polished but dull triangular piece of metal, its edges smooth. Strange engravings mark both faces — worn, but not quite illegible.'
  },

  old_metal_plate: {
    name: 'Old Metal Plate',
    category: 'relic',
    weight: 1,
    description: 'A dented plate, its surface dulled with age. Once someone ate from this, in a world that no longer exists.'
  },

  old_cup: {
    name: 'Old Cup',
    category: 'relic',
    weight: 1,
    description: 'A tarnished cup, cold and empty. It rattles faintly, as if something long dried still clings inside.'
  },

  eadric_locket: {
    name: 'Tarnished Locket',
    category: 'relic',
    weight: 1,
    questItem: true,
    description: 'A small locket, its hinge stiff with age. Empty inside — whatever picture it once held is long gone.'
  },

  eadric_pipe: {
    name: 'Cracked Pipe',
    category: 'relic',
    weight: 1,
    questItem: true,
    description: "A wooden pipe, its bowl split clean through. Well-used, once, by someone who clearly loved it."
  },

  wood: {
    name: 'Wood',
    category: 'material',
    weight: 2,
    description: 'A length of dry, sturdy wood. Useful for little on its own.'
  },

  sharp_metal_shard: {
    name: 'Sharp Metal Shard',
    category: 'material',
    weight: 1,
    description: 'A jagged shard of metal, its edge still keen. Cuts, if handled carefully.'
  },

  cloth: {
    name: 'Cloth',
    category: 'material',
    weight: 1,
    description: 'A scrap of coarse, weathered cloth. Sturdier than it looks.'
  },

  twine: {
    name: 'Twine',
    category: 'material',
    weight: 0,
    description: 'A coil of rough twine, still strong enough to bind.'
  },

  wooden_stick: {
    name: 'Polished Wooden Stick',
    category: 'material',
    weight: 1,
    questItem: true,
    description: 'A smooth, polished stick, worn soft by years of handling. The moment it nears the triangular piece of metal in your pack, the engravings flare with a faint, wordless light.'
  },

  wooden_codex: {
    name: 'Wooden Codex',
    category: 'material',
    weight: 1,
    questItem: true,
    description: 'The polished stick is gone — in its place, a cylinder of dark, grained wood, ringed with dials carved in strange letters. They match the marks on your piece of metal exactly.'
  },

  vellum_parchment: {
    name: 'Vellum Parchment',
    category: 'lore',
    weight: 0,
    questItem: true,
    description: 'A brittle sheet of vellum, marked with strange writing. Something about it feels familiar — the same hand, you\'re almost certain, that carved the stele.'
  },

  wild_berries: {
    name: 'Wild Berries',
    category: 'food',
    weight: 0,
    restore: { stamina: 5 },
    description: 'A small handful of dark berries, found low in the undergrowth. Edible, if not plentiful.'
  },

  potato: {
    name: 'Potato',
    category: 'food',
    weight: 0,
    restore: { stamina: 8 },
    description: 'A single potato, pulled from soft earth. Unremarkable, and welcome for it.'
  },

  boar_meat: {
    name: 'Boar Meat',
    category: 'food',
    weight: 1,
    restore: { stamina: 15 },
    description: 'Raw meat, still warm. Taken from something that no longer needs it.'
  },

  water: {
    name: 'Water',
    category: 'food',
    weight: 2,
    restore: { stamina: 10 },
    description: 'A skin of clean water, drawn from a source that still runs true.'
  },

  herbs: {
    name: 'Herbs',
    category: 'food',
    weight: 0,
    restore: { constitution: 10 },
    description: 'A bundle of wild herbs, sharp-smelling. Chewed raw, they do little for hunger — but they mend what hunger cannot.'
  },

  rusty_sword: {
    name: 'Rusty Sword',
    category: 'weapon',
    weight: 3,
    description: 'A blade from before the fracture, pitted with rust but not yet broken. Heavier than it looks.'
  },

  primitive_knife: {
    name: 'Primitive Knife',
    category: 'weapon',
    weight: 1,
    description: 'Wood bound tight to sharpened metal. Crude, but it holds an edge.'
  },

  stew: {
    name: 'Stew',
    category: 'food',
    weight: 1,
    restore: { stamina: 25 },
    description: 'A thick stew, simmered from whatever the worlds would give up. Better hot.'
  },

  bag: {
    name: 'Old Canvas Bag',
    category: 'gear',
    weight: 0,
    description: 'Cloth bound tight with twine round a sliver of old metal. Rough, but it holds more than your arms alone ever could.'
  },

  strong_medicine: {
    name: 'Strong Medicine',
    category: 'medicine',
    weight: 1,
    restore: { constitution: 'full' },
    description: 'A pungent draught, herb steeped in water until thick as syrup. Bitter, but it mends what little else can.'
  },

  old_book: {
    name: 'Old Book',
    category: 'lore',
    weight: 2,
    description: 'A weathered book, its pages soft with handling. It speaks of Arian — general, inventor, and by its own account, a crueler man than history remembers. His Alchemists, it says, were the ones who truly gave his inventions their teeth.'
  },

  everlasting_plant: {
    name: 'Everlasting Plant',
    category: 'plant',
    weight: 0,
    questItem: true,
    description: 'A pale, unassuming flower, said to grant everlasting youth to those who eat it and survive its poison. The moment you touch it, the engravings on your piece of metal begin to glow.'
  }
}