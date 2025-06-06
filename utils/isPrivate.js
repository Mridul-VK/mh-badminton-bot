const db = require('../db');

module.exports = isPrivate = async (ctx) => {
    if (ctx.chat.type == "private") {
        const res = await db.query("SELECT * FROM bot_variable WHERE key = 'privateCommandReply'");
        return ctx.reply(res.rows[0].value, {
            parse_mode: "HTML",
        });
    }
    return;
};