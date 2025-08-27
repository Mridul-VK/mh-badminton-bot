const { Scenes } = require("telegraf");
const { isAdmin, pairSlots } = require("../utils");
const { removeAdmin } = require("../utils/dbAccess");

const removeAdminScene = new Scenes.BaseScene("REMOVE_ADMIN_SCENE");

removeAdminScene.enter(async (ctx) => {
  const res = await isAdmin(ctx);
  if (!res) return ctx.scene.leave();

  const { admins } = res;
  if (!admins.length) {
    await ctx.reply(
      "Oho! it appears that there aren't any admins at the moment. Maybe add a few to remove them 😜"
    );
    return ctx.scene.leave();
  }
  const pairedAdmins = pairSlots(admins);
  let adminButtonList = [];
  pairedAdmins.forEach((adminPair) => {
    if (adminPair.length == 2) {
      adminButtonList.push([
        {
          text: adminPair[0].name,
          callback_data: adminPair[0].user_id,
        },
        {
          text: adminPair[1].name,
          callback_data: adminPair[1].user_id,
        },
      ]);
    }
    if (adminPair.length == 1) {
      adminButtonList.push([
        {
          text: adminPair[0].name,
          callback_data: adminPair[0].user_id,
        },
      ]);
    }
  });
  ctx.reply(`Ohkay, let's get rid of some admins off of the list`, {
    reply_markup: {
      inline_keyboard: adminButtonList,
    },
  });
  ctx.scene.state.commandUser = ctx.from;
});

removeAdminScene.on("callback_query", async (ctx) => {
  if (!ctx.callbackQuery?.data) return ctx.scene.leave();
  if (
    parseInt(ctx.callbackQuery.from.id) !=
    parseInt(ctx.scene.state.commandUser.id)
  ) {
    ctx.deleteMessage(ctx.callbackQuery.message.message_id); // Delete the message with the inline keyboard
    ctx.answerCbQuery("Only the user who initiated the command can respond.");
    return ctx.scene.leave();
  }

  ctx.callbackQuery.message
    ? await ctx.deleteMessage(ctx.callbackQuery.message.message_id)
    : null;

  await removeAdmin(ctx.callbackQuery.data);

  await ctx.reply(
    `Alright! Selected ${`[admin](tg://user?id=${ctx.callbackQuery.data})`} has successfully been removed`,
    {
      parse_mode: "Markdown",
    }
  );
  await ctx.answerCbQuery();
  return ctx.scene.leave();
});

module.exports = removeAdminScene;
