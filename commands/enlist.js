// Command handler for displaying today's bookings
const { resetSlots } = require("../utils");
const db = require('../db.json');

module.exports = {
  name: "enlist",
  // Callback function for the enlist command
  callback: (ctx) => {
    const today = new Date();
    let { currentDatetime } = db
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
    // Get and display the formatted list of today's bookings
    const bookingListArray = getBookingsArray();
    ctx.reply(
      `*Today's Bookings*\n${"-".repeat(20)}\n\n${bookingListArray.join(
        "\n"
      )}`,
      {
        parse_mode: "Markdown",
      }
    );
  },
};
