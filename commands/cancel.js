// Command handler for cancelling a reserved slot
const db = require("../db.js");
const { commands } = require("../handlers/commandHandler.js");

module.exports = {
  name: "cancel",
  desc: "Cancel your slot",
  isAdmin: false,
  // Callback function for the cancel command
  callback: async (ctx) => {
    try {
      // Restrict command usage to group chats only
      const isPrivateChat = await isPrivate(ctx); // Ensure the command is not used in a private chat
      if (isPrivateChat) {
        return;
      }

      // Find all slots reserved by the user
      const userSlot = await db.query("SELECT * FROM booking WHERE user_id = $1", [ctx.from.id]);

      // if there's a slot, remove user's details from it
      if (!userSlot.rows.length) return ctx.reply("You have no slots reserved to cancel.");
      if (parseInt(userSlot[0]) - 15 * 60 * 1000 < new Date().getTime()) return ctx.reply("Well, you can't do that. You cannot cancel a slot from 15 minutes prior to the slot time");
      await db.query("UPDATE booking SET user_id = '', name = '' WHERE user_id = $1", [ctx.from.id]) && ctx.reply("Your slot has been successfully cancelled.");
      await commands.enlist(ctx);
    } catch (error) {
      console.log("Error cancelling slot:", error);
    }
  },
};
