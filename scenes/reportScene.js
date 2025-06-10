const db = require("../db");
const { Scenes } = require("telegraf");
const { message } = require("telegraf/filters");

const reportScene = new Scenes.BaseScene("REPORT_SCENE");
/* The `reportScene.enter` method is a function that is triggered when the user enters the
`REPORT_SCENE`. In this case, it is an asynchronous function that takes `ctx` (context) as a
parameter. Inside this function, it sends a message to the user using `ctx.reply`, prompting them to
describe the issue they are facing. This message serves as an initial prompt for the user to provide
the necessary information for the report. */
reportScene.enter(async (ctx) => {
    await ctx.reply("Please describe the issue you are facing!");
});

/* The `reportScene.on(message("text"), async (ctx) => { ... })` function is an event handler in the
`reportScene` scene. It is triggered when the user sends a text message while in the `REPORT_SCENE`.
Here's a breakdown of what this function does: */
reportScene.on(message("text"), async (ctx) => {
    const report = ctx.message.text;

    let dbAdmins = await db.query("SELECT * FROM admin");
    let adminIds = dbAdmins.rows.map(admin => admin.user_id);
    let owner = await db.query("SELECT * FROM bot_variable WHERE key = 'owner'");
    owner = owner.rows[0].value;

    let admins = adminIds.concat(owner);

    /* This part of the code is iterating over the `admins` array, which contains the user IDs of all
    the admins and the owner. For each admin, it sends a Telegram message using
    `ctx.telegram.sendMessage()` to notify them about a new report that has been received. The
    message includes details like the date, sender's name, and the report content formatted in
    Markdown. */
    admins.forEach(admin => {
        ctx.telegram.sendMessage(admin, `*🔔 New report received! 🔔*\n\nDate: ${new Date().toLocaleString()}\nFrom: [${`${ctx.from.first_name} ${ctx.from.last_name || ""}`.trim()}](tg://user?id=${ctx.from.id})\n\n⚠️*REPORT*\n${'-'.repeat(20)}\n${report}\n${'-'.repeat(20)}\n\nIf you'd like to respond to the issuer, click on the name of the issuer`, { parse_mode: "Markdown" });
    });

    await ctx.reply(`Thank you for your valuable report.\n\n⚠️*YOUR REPORT*\n${'-'.repeat(20)}\n${report}\n${'-'.repeat(20)}\n\nWe much appreciate the effort. The admins have been notified. We will look into it ASAP.\n\nHave a great day ahead 😄!`, { parse_mode: "Markdown" });
    await ctx.scene.leave();
});

module.exports = reportScene;