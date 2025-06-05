const db = require('../db');
const { resetSlots } = require('./resetSlots');

module.exports = isToday = async () => {
    const today = new Date();
    let currentDatetime = await db.query("SELECT value FROM bot_variable WHERE key = 'currentDatetime'");
    !currentDatetime
        ? currentDatetime = today && await db.query(`INSERT INTO bot_variable (key, value) VALUES ('currentDatetime', $1) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`, [today.getTime()])
        : currentDatetime = new Date(parseInt(currentDatetime.rows[0].value));

    // Reset slots if the day has changed
    if ((today.getTime() - currentDatetime.getTime()) / (1000 * 60 * 60 * 24) >= 1) {
        await resetSlots(today);
    }
};