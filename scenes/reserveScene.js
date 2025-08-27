const { Scenes } = require("telegraf");
const { laydownButtons, pairSlots, isPrivate } = require("../utils");
const { commands } = require("../handlers/commandHandler");
const { getBooking, getDb, updateBooking } = require("../utils/dbAccess");

const STEP1 = async (ctx) => {
  // Restrict command usage to group chats only
  const isPrivateChat = await isPrivate(ctx); // Ensure the command is not used in a private chat
  if (isPrivateChat) {
    return ctx.scene.leave();
  }
  // Prevent double booking by the same user
  const booking = await getBooking({ user_id: ctx.message.from.id });
  if (booking) {
    ctx.reply(
      `⚠️ <b>ERROR: UNAUTHORISED</b> ⚠️\n\nI'm sorry but according to Hostel policy, one's allowed to reserve only one slot per day at max.\n\nThank you for understanding 😄`,
      {
        parse_mode: "HTML",
      }
    );
    return ctx.scene.leave();
  }

  const availableSlots = (await getDb()).bookings.filter(
    (slotObj) =>
      slotObj.user_id == "" &&
      slotObj.slot - 15 * 60 * 1000 > new Date().getTime()
  );

  const reqdDate = new Date().setUTCHours(15, 45, 0, 0);
  if (Date.now() > reqdDate) {
    await ctx.reply(
      "Oops, you're a bit too late buddy. Slot booking time is up already!"
    );
    return ctx.scene.leave();
  }
  // If all slots are reserved
  if (!availableSlots.length) {
    ctx.reply("We're sorry, looks like all slots are reserved");
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
    return ctx.reply(
      "Unauthorized action! You cannot reserve a slot for someone else."
    );
  }

  await ctx.telegram.deleteMessage(
    ctx.chat.id,
    ctx.callbackQuery.message.message_id
  );
  const callbackData = JSON.parse(ctx.callbackQuery.data);
  await updateBooking(
    callbackData.slot,
    ctx.callbackQuery.from.first_name +
      (ctx.callbackQuery.from.last_name
        ? " " + ctx.callbackQuery.from.last_name
        : ""),
    ctx.callbackQuery.from.id
  );

  await ctx.reply(`Your slot has been successfully reserved!`);

  await commands.enlist(ctx);
  ctx.answerCbQuery();
  return ctx.scene.leave();
};

module.exports = reserveScene = new Scenes.WizardScene(
  "RESERVE_SCENE",
  STEP1,
  STEP2
);
