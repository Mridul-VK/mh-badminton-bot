/* This code snippet is defining a JavaScript function called `pairSlots` and exporting it as a module.
The `pairSlots` function takes an array `slots` as input and pairs the elements of the array into
subarrays of two elements each. */
module.exports = pairSlots = (slots) => {
  const combinedSlots = [];
  // Iterate through slots in steps of 2, pairing them
  for (let i = 0; i < slots.length; i += 2) {
    if (slots[i + 1]) combinedSlots.push([slots[i], slots[i + 1]]);
    else combinedSlots.push([slots[i]]);
  }
  return combinedSlots;
};