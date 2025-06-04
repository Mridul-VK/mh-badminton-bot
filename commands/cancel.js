// Command handler for cancelling a reserved slot
const { resetSlots } = require("../utils");
const db = require("../db.js");

module.exports = {
  name: "cancel",
  // Callback function for the cancel command
  callback: async (ctx) => {
    try {
      const today = new Date();
      let currentDatetime = await db.query("SELECT value FROM bot_variable WHERE key = 'currentDatetime'");
      !currentDatetime
        ? currentDatetime = today && await db.query("UPDATE bot_variable SET value = $1 WHERE key = 'currentDatetime'", [today.getTime()])
        : currentDatetime = new Date(parseInt(currentDatetime.rows[0].value));

      // Reset slots if the day has changed
      if ((today.getTime() - currentDatetime.getTime()) / (1000 * 60 * 60 * 24) >= 1) {
        await resetSlots(today);
      }

      // Restrict command usage to group chats only
      if (ctx.chat.type == "private")
        return ctx.reply(
          `<b>❗❗IMPORTANT❗❗</b>\n\nI'm sorry but to make sure that you're one of our MH inmates, we have restricted all commands in private chats. Please contact the Hostel Committee to add you to the MH Badminton group\n\nThank you 😄`,
          {
            parse_mode: "HTML",
          }
        );

      // Find all slots reserved by the user
      const userSlot = await db.query("SELECT * FROM booking WHERE user_id = $1", [ctx.from.id]);

      // if there's a slot, remove user's details from it
      userSlot.rows.length
        ? await db.query("UPDATE booking SET user_id = '', name = '' WHERE user_id = $1", [ctx.from.id]) && ctx.reply("Your slot has been successfully cancelled.")
        : ctx.reply("You have no slots reserved to cancel.");
    } catch (error) {
      console.error("Error cancelling slot:", error.message);
    }
  },
};
