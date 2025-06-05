// Command handler for reserving a slot
module.exports = {
  name: "reserve",
  // Callback function for the reserve command
  callback: (ctx) => ctx.scene.enter("RESERVE_SCENE"),
};
