// Command handler for cancelling a reserved slot
const { commands } = require("../handlers/commandHandler.js");
const { getBooking, updateBooking } = require("../utils/dbAccess.js");

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
      const userSlot = await getBooking({ user_id: ctx.from.id });

      // if there's a slot, remove user's details from it
      if (!userSlot) return ctx.reply("You have no slots reserved to cancel.");
      // if (parseInt(userSlot[0]) - 15 * 60 * 1000 < new Date().getTime())
      //   return ctx.reply(
      //     "Well, you can't do that. You cannot cancel a slot from 15 minutes prior to the slot time"
      //   );
      await updateBooking(userSlot.slot);
      await ctx.reply("Your slot has been successfully cancelled.");
      await commands.enlist(ctx);
    } catch (error) {
      console.log("Error cancelling slot:", error);
    }
  },
};
