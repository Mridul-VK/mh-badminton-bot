const { resetSlots } = require("../../utils");

module.exports = {
    name: "reset",
    callback: async (ctx) => {
        try {
            await resetSlots();
            ctx.reply("All slots have been reset successfully.");
        } catch (error) {
            console.error("An error occurred while executing the reset command:", error);
        }
    }
};