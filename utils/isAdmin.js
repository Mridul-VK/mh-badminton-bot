const db = require('../db');

module.exports = isAdmin = async (ctx) => {
    let owner = (await db.query("SELECT * FROM bot_variable WHERE key = 'owner'")).rows[0].value;
    let admins = (await db.query("SELECT * FROM admin")).rows;

    if (ctx.from.id != owner && !admins.find(admin => admin.user_id == ctx.from.id)) { // User is either the owner or an admin
        ctx.reply("NOT AUTHORISED!");
        return;
    }
    return { admins, owner };
};