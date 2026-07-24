import { ITEMS } from '../../data/entities/items'

const BASE_CAPACITY = 30
const BAG_CAPACITY = 50

export function getItemWeight(itemId) {
  return ITEMS[itemId]?.weight ?? 0
}

export function getTotalWeight(inventory) {
  return inventory.reduce((sum, itemId) => sum + getItemWeight(itemId), 0)
}

export function getCapacity(inventory) {
  return inventory.includes('bag') ? BAG_CAPACITY : BASE_CAPACITY
}

export function canCarry(inventory, itemId) {
  return getTotalWeight(inventory) + getItemWeight(itemId) <= getCapacity(inventory)
}