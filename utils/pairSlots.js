// Utility to pair slots into subarrays of two for easier handling
module.exports = pairSlots = (slots) => {
  const combinedSlots = [];
  // Iterate through slots in steps of 2, pairing them
  for (let i = 0; i < slots.length; i += 2) {
    if (slots[i + 1]) combinedSlots.push([slots[i], slots[i + 1]]);
    else combinedSlots.push([slots[i]]);
  }
  return combinedSlots;
};