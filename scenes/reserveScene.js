const { Scenes } = require("telegraf");
const { laydownButtons, pairSlots, isPrivate } = require("../utils");
const { commands } = require("../handlers/commandHandler");
const db = require("../db");

const STEP1 = async (ctx) => {
    // Restrict command usage to group chats only
    const isPrivateChat = await isPrivate(ctx); // Ensure the command is not used in a private chat
    if (isPrivateChat) {
        return ctx.scene.leave();
    }
    // Prevent double booking by the same user
    const booking = (await db.query("SELECT * FROM booking WHERE user_id = $1", [
        ctx.message.from.id,
    ])).rows[0];
    if (booking) {
        ctx.reply(
            `⚠️ <b>ERROR: UNAUTHORISED</b> ⚠️\n\nI'm sorry but according to Hostel policy, one's allowed to reserve only one slot per day at max.\n\nThank you for understanding 😄`,
            {
                parse_mode: "HTML",
            }
        );
        return ctx.scene.leave();
    }

    const availableSlots = (await db.query(
        "SELECT * FROM booking WHERE user_id = ''",
    )).rows.filter(slot => slot.slot - 15 * 60 * 1000 > new Date().getTime());

    // If all slots are reserved
    if (!availableSlots.length) {
        ctx.reply("We're sorry, Either booking time is up or All slots are reserved");
        return ctx.scene.leave();
    }
    // Show available slots for today
    if (availableSlots.length) {
        availableSlots.sort((a, b) => a.slot - b.slot);
        let slots = pairSlots(availableSlots);
        ctx.reply(
            `Alright! let's get you a slot to play Badminton today. Here are the available slots today. Go on, select one that you're comfortable with.\n\nIf you want to abort this operation, just type /abort`,
            {
                reply_markup: {
                    inline_keyboard: laydownButtons(slots),
                },
            }
        );
    }
    ctx.wizard.state.user_id = ctx.message.from.id;
    ctx.wizard.next();
};

const STEP2 = async (ctx) => {
    if (!ctx.callbackQuery?.data) return ctx.scene.leave();
    if (ctx.wizard.state.user_id != ctx.callbackQuery.from.id) {
        return ctx.reply("Unauthorized action! You cannot reserve a slot for someone else.");
    }

    await ctx.telegram.deleteMessage(
        ctx.chat.id,
        ctx.callbackQuery.message.message_id
    );
    const callbackData = JSON.parse(ctx.callbackQuery.data);
    await db.query("UPDATE booking SET user_id = $1, name = $2 WHERE slot = $3", [ctx.callbackQuery.from.id, `${ctx.callbackQuery.from.first_name} ${ctx.callbackQuery.from.last_name ? ctx.callbackQuery.from.last_name : ""}`.trim(), callbackData.slot]);

    await ctx.reply(
        `Your slot has been successfully reserved!`
    );

    await commands.enlist(ctx);
    ctx.answerCbQuery();
    return ctx.scene.leave();
};

module.exports = reserveScene = new Scenes.WizardScene("RESERVE_SCENE", STEP1, STEP2);