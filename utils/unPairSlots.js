// Utility to flatten paired slots into a single array
module.exports = unPairSlots = (slots) => {
  let currentSlots = [];
  // Iterate through each slot pair and add both slots to the result array
  slots.forEach((slotPair) => {
    currentSlots.push(slotPair[0]);
    slotPair[1] ? currentSlots.push(slotPair[1]) : null;
  });
  return currentSlots;
};