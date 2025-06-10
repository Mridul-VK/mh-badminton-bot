const db = require('../db');

/* This code snippet is exporting a function named `isAdmin` as a module in a Node.js environment. The
function takes a `ctx` parameter, which is likely to be a context object representing some kind of
user interaction. */
module.exports = isAdmin = async (ctx) => {
    /* These lines of code are querying a database using the `db` module to retrieve information about
    the owner and admins of a bot. */
    let owner = (await db.query("SELECT * FROM bot_variable WHERE key = 'owner'")).rows[0].value;
    let admins = (await db.query("SELECT * FROM admin")).rows;

    /* This `if` statement is checking whether the user interacting with the bot is either the owner or
    an admin. It does this by comparing the `id` of the user from the `ctx` object with the `owner`
    variable and checking if the user's `id` is not found in the list of `admins`. */
    if (ctx.from.id != owner && !admins.find(admin => admin.user_id == ctx.from.id)) { // User is either the owner or an admin
        ctx.reply("NOT AUTHORISED!");
        return;
    }
    return { admins, owner };
};