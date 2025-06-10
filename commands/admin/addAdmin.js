// Command handler for entering the add admin scene
module.exports = {
  name: "addAdmin",
  // Callback function to trigger the add admin scene
  callback: (ctx) => {
    ctx.scene.enter("ADD_ADMIN_SCENE");
  },
};
