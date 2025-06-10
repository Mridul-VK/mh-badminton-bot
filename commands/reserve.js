// Command handler for reserving a slot
module.exports = {
  name: "reserve",
  desc: "Book a slot",
  isAdmin: false,
  // Callback function for the reserve command
  callback: (ctx) => ctx.scene.enter("RESERVE_SCENE"),
};
