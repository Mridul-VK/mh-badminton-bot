const db = require('../db');
const resetSlots = require('./resetSlots');

/* This code snippet is exporting a function named `isToday` as a module. The function is an
asynchronous arrow function that checks if the current date matches the stored date in the database.
Here's a breakdown of what the code does: */
module.exports = isToday = async () => {
    const today = new Date();
    let currentDatetime = await db.query("SELECT value FROM bot_variable WHERE key = 'currentDatetime'");
    !currentDatetime
        ? currentDatetime = today && await db.query(`INSERT INTO bot_variable (key, value) VALUES ('currentDatetime', $1) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`, [today.getTime()])
        : currentDatetime = new Date(parseInt(currentDatetime.rows[0].value));

    // Reset slots if the day has changed
    if (today.getFullYear() !== currentDatetime.getFullYear() || today.getMonth() !== currentDatetime.getMonth() || today.getDate() !== currentDatetime.getDate()) {
        await resetSlots(today);
    }
};