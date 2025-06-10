/* The code snippet is defining a JavaScript function named `unPairSlots` and exporting it as a module
using `module.exports`. */
module.exports = unPairSlots = (slots) => {
  let currentSlots = [];
  // Iterate through each slot pair and add both slots to the result array
  slots.forEach((slotPair) => {
    currentSlots.push(slotPair[0]);
    slotPair[1] ? currentSlots.push(slotPair[1]) : null;
  });
  return currentSlots;
};