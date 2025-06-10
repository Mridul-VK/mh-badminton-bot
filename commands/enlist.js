// Command handler for displaying today's bookings
const { isPrivate } = require("../utils");
const db = require("../db.js");

module.exports = {
  name: "enlist",
  desc: "Enlist bookings",
  isAdmin: false,
  // Callback function for the enlist command
  callback: async (ctx) => {
    // Restrict command usage to group chats only
    const isPrivateChat = await isPrivate(ctx); // Ensure the command is not used in a private chat
    if (isPrivateChat) {
      return;
    }

    // Fetching all the bookings
    let bookings = await db.query("SELECT * FROM booking ORDER BY slot");
    let bookingsArray = [];
    for (let booking of bookings.rows) {
      bookingsArray.push(
        `${new Date(parseInt(booking.slot)).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' })}: ${booking.name && booking.user_id ? `[${booking.name}](tg://user?id=${booking.user_id})` : ""}`
      );
    }
    ctx.reply(
      `*Today's Bookings*\n${"-".repeat(20)}\n\n${bookingsArray.join("\n")}`,
      {
        parse_mode: "Markdown",
      }
    );
  },
};
