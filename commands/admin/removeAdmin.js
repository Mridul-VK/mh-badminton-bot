module.exports = {
    name: "removeAdmin",
    desc: "Removes an admin",
    isAdmin: true,
    callback: async (ctx) => {
        ctx.scene.enter("REMOVE_ADMIN_SCENE");
    }
};