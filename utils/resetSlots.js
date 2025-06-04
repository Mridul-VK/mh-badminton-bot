// Utility to reset all slots and bookings for a new day
const db = require("../db.js");

// Resets slots and bookings, optionally for a provided date
module.exports = resetSlots = async (today) => {
  try {
    let currentDatetime = today ? today : new Date();
    await db.query(`UPDATE bot_variable SET value = $1 WHERE key = 'currentDatetime'`, [currentDatetime.getTime()]);
    await db.query("DELETE FROM booking");
    currentDatetime.setHours(15, 30, 0, 0);
    for (let i = 0; i < 7; i++) {
      await db.query("INSERT INTO booking (user_id, name, slot) VALUES ($1, $2, $3)", ["", "", currentDatetime.getTime()+(i*60*60*1000)]);
    }
  } catch (error) {
    console.error("Error resetting slots:", error.message);
  }
};
