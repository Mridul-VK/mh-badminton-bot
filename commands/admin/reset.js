const { resetSlots, isAdmin } = require("../../utils");

module.exports = {
    name: "reset",
    desc: "Resets the slots",
    isAdmin: true,
    callback: async (ctx) => {
        try {
            const isPrivateChat = await isPrivate(ctx); // Ensure the command is not used in a private chat
            if (isPrivateChat) return;

            let res = await isAdmin(ctx);
            if (!res) return;

            await resetSlots();
            ctx.reply("All slots have been reset successfully.");
        } catch (error) {
            console.error("An error occurred while executing the reset command:", error);
        }
    }
};