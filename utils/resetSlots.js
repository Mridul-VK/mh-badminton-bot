// Utility to reset all slots and bookings for a new day
const db = require("../db.js");

// Resets slots and bookings, optionally for a provided date
/* This code snippet is defining a function named `resetSlots` that is being exported as a module in a
Node.js environment. Here's a breakdown of what the function does: */
module.exports = resetSlots = async (today) => {
  try {
    let currentDatetime = today ? today : new Date();
    await db.query(`INSERT INTO bot_variable (key, value) VALUES ('currentDatetime', $1) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`, [currentDatetime.getTime()]);
    await db.query("DELETE FROM booking");
    currentDatetime.setUTCHours(10, 0, 0, 0);
    for (let i = 0; i < 7; i++) {
      await db.query("INSERT INTO booking (user_id, name, slot) VALUES ($1, $2, $3)", ["", "", currentDatetime.getTime() + (i * 60 * 60 * 1000)]);
    }
  } catch (error) {
    console.error("Error resetting slots:", error.message);
  }
};
