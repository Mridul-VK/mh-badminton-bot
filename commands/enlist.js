// Command handler for displaying today's bookings
const { isPrivate, isToday } = require("../handlers/utilHandler.js");
const db = require("../db.js");

module.exports = {
  name: "enlist",
  // Callback function for the enlist command
  callback: async (ctx) => {
    // Reset slots if the day has changed
    await isToday();
    
    // Restrict command usage to group chats only
    await isPrivate(ctx);
    
    // Fetching all the bookings
    let bookings = await db.query("SELECT * FROM booking ORDER BY slot");
    let bookingsArray = [];
    for (let booking of bookings.rows) {
      bookingsArray.push(
        `${new Date(parseInt(booking.slot)).toLocaleTimeString()}: ${booking.name && booking.user_id ? `[${booking.name}](tg://user?id=${booking.user_id})` : ""}`
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
