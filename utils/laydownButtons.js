/* This code snippet is defining a JavaScript function named `laydownButtons` that generates inline
keyboard buttons for slot selection based on the input `slots` array. Here's a breakdown of what the
function does: */
module.exports = laydownButtons = (slots) => {
  const buttons = [];
  // Iterate through each slot and create button(s) for each
  slots.forEach((availableSlotObject) => {
    if (availableSlotObject.length == 2) {
      // If slot pair, create two buttons in a row
      buttons.push([
        {
          text: new Date(parseInt(availableSlotObject[0].slot)).toLocaleTimeString(),
          callback_data: JSON.stringify({ slot: availableSlotObject[0].slot }),
        },
        {
          text: new Date(parseInt(availableSlotObject[1].slot)).toLocaleTimeString(),
          callback_data: JSON.stringify({ slot: availableSlotObject[1].slot }),
        },
      ]);
    } else if (availableSlotObject.length == 1) {
      // If only one slot, create a single button row
      buttons.push([
        {
          text: new Date(parseInt(availableSlotObject[0].slot)).toLocaleTimeString(),
          callback_data: JSON.stringify({ slot: availableSlotObject[0].slot }),
        },
      ]);
    }
  });
  return buttons;
};
