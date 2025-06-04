// Command handler for cancelling a reserved slot
const { resetSlots, pairSlots, laydownButtons } = require("../utils");
const db = require("../db.json");

module.exports = {
  name: "cancel",
  // Callback function for the cancel command
  callback: (ctx) => {
    const today = new Date();
    let { currentDatetime, bookings } = db;
    // Reset slots if the day has changed
    if (today.getDate() > currentDatetime.getDate()) {
      ({ currentDatetime, slots, bookings } = resetSlots(today));
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
    let userSlots = [];
    for (let slot in bookings) {
      bookings[slot].id == ctx.message.from.id
        ? userSlots.push(parseInt(slot))
        : null;
    }
    // If user has no slots reserved, inform them
    if (!userSlots.length) {
      return ctx.reply(
        "Looks like you have no slots reserved for the day. Use /reserve to reserve one."
      );
    }
    // Prepare and show the user's reserved slots for cancellation
    userSlots.sort();
    userSlots = pairSlots(userSlots);
    ctx.telegram.sendMessage(
      ctx.chat.id,
      "Select the slot you'd like to delete",
      {
        reply_markup: {
          inline_keyboard: laydownButtons(userSlots, "cancel"),
        },
      }
    );
  },
};
