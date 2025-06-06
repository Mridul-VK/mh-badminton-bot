// Command handler for cancelling a reserved slot
const db = require("../db.js");
const { isToday } = require("../utils");

module.exports = {
  name: "cancel",
  // Callback function for the cancel command
  callback: async (ctx) => {
    try {
      // Reset slots if the day has changed
      await isToday();

      // Restrict command usage to group chats only
      const isPrivateChat = await isPrivate(ctx); // Ensure the command is not used in a private chat
      if(isPrivateChat) {
        return;
      }

      // Find all slots reserved by the user
      const userSlot = await db.query("SELECT * FROM booking WHERE user_id = $1", [ctx.from.id]);

      // if there's a slot, remove user's details from it
      userSlot.rows.length
        ? await db.query("UPDATE booking SET user_id = '', name = '' WHERE user_id = $1", [ctx.from.id]) && ctx.reply("Your slot has been successfully cancelled.")
        : ctx.reply("You have no slots reserved to cancel.");
    } catch (error) {
      console.log("Error cancelling slot:", error);
    }
  },
};
