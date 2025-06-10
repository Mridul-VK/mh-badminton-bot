const { resetSlots } = require("../../utils");

module.exports = {
    name: "reset",
    callback: async (ctx) => {
        try {
            await resetSlots();
        } catch (error) {
            console.error("An error occurred while executing the reset command:", error);
        }
    }
};