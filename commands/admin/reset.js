const { resetSlots, isAdmin } = require("../../utils");

module.exports = {
    name: "reset",
    desc: "Resets the slots",
    isAdmin: true,
    callback: async (ctx) => {
        try {
            await ctx.scene.enter("RESET_SCENE");
        } catch (error) {
            console.error("An error occurred while executing the reset command:", error);
        }
    }
};