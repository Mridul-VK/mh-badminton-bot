// Command handler for reserving a slot
const db = require("../db.json");
const {
  resetSlots,
  unPairSlots,
  pairSlots,
  laydownButtons,
} = require("../utils");

module.exports = {
  name: "reserve",
  // Callback function for the reserve command
  callback: (ctx) => {
    let { currentDatetime, slots, bookings } = db
    const today = new Date();
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
    // Prevent double booking by the same user
    for (let booking of Object.values(bookings)) {
      if (booking.id == ctx.message.from.id) {
        return ctx.reply(
          `⚠️ <b>ERROR: UNAUTHORISED</b> ⚠️\n\nI'm sorry but according to Hostel policy, one's allowed to reserve only one slot per day at max.\n\nThank you for understanding 😄`,
          {
            parse_mode: "HTML",
          }
        );
      }
    }
    // If all slots are reserved
    if (!slots.length && currentDatetime.getDate() == today.getDate()) {
      return ctx.reply("We're sorry, All slots are reserved");
    }
    // Show available slots for today
    if (today.getDate() == currentDatetime.getDate() && slots.length) {
      let currentSlots = unPairSlots(slots);
      currentSlots.sort();
      slots = pairSlots(currentSlots);
      ctx.telegram.sendMessage(
        ctx.chat.id,
        `Alright! let's get you a slot to play Badminton today. Here are the available slots today. Go on, select one that you're comfortable with.`,
        {
          reply_markup: {
            inline_keyboard: laydownButtons(slots, "reserve"),
          },
        }
      );
    }
  },
};
