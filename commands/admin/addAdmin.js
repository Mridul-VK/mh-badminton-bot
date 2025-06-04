// Command handler for entering the add admin scene
export default {
  name: "addAdmin",
  // Callback function to trigger the add admin scene
  callback: (ctx) => {
    ctx.scene.enter("ADD_ADMIN_SCENE");
  },
};
