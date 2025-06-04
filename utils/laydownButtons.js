// Utility to generate inline keyboard buttons for slot selection
module.exports = laydownButtons = (slots, command) => {
  const buttons = [];
  // Iterate through each slot and create button(s) for each
  slots.forEach((slot, index) => {
    if (slot.length == 2) {
      // If slot pair, create two buttons in a row
      buttons.push([
        {
          text: new Date(slot[0]).toLocaleTimeString(),
          callback_data: JSON.stringify({
            indices: [index, 0].join(),
            command,
          }),
        },
        {
          text: new Date(slot[1]).toLocaleTimeString(),
          callback_data: JSON.stringify({
            indices: [index, 1].join(),
            command,
          }),
        },
      ]);
    } else if (slot.length == 1) {
      // If only one slot, create a single button row
      buttons.push([
        {
          text: new Date(slot[0]).toLocaleTimeString(),
          callback_data: JSON.stringify({
            indices: [index, 0].join(),
            command,
          }),
        },
      ]);
    } else {
      // Remove empty slot rows
      buttons.splice(index, 1);
    }
  });
  return buttons;
};
