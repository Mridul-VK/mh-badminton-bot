const { Scenes } = require("telegraf");
const db = require("../db.json");
const { message } = require("telegraf/filters");
const { updateDB, pairSlots } = require("../utils");

//Initialize the scene for collecting admin IDs
const addAdminScene = new Scenes.BaseScene("ADD_ADMIN_SCENE");

//Enter the scene when the command is triggered
addAdminScene.enter(async (ctx) => {
  // Check if the user is the owner or an admin
  if (ctx.from.id != db.owner && !db.admins.includes(ctx.from.id)) {
    ctx.reply("NOT AUTHORISED!");
    return ctx.scene.leave();
  }

  //get the list of admins in the group
  let admins = await ctx.getChatAdministrators(ctx.chat.id);

  // Exclude the bot itself and the user who initiated the command along with already existing admins in the db and the owner
  admins = admins.filter(
    (admin) =>
      admin.user.id != ctx.botInfo.id && !db.admins.includes(admin.user.id) && admin.user.id != ctx.from.id && admin.user.id != db.owner
  );

  // Checking if the person to be added as admin is not an admin of the group
  if (admins.length == 0) {
    ctx.reply(
      "Seems like the person you're trying to add as an admin is not an admin of the group.\n\nIf you want to add a new admin, please make sure they are an admin of this group and try again."
    );
    return ctx.scene.leave();
  }

  // Pairing the admins into pairs for the inline keyboard
  // This is done to make the inline keyboard more user-friendly
  const pairedAdmins = pairSlots(admins);

  // Initialize the button list for the inline keyboard
  // Each button will have the admin's name and a callback data with their ID and command
  let adminButtonList = [];
  pairedAdmins.forEach((adminPair) => {
    // If the pair has two admins, create a button for each
    if (adminPair.length == 2) {
      adminButtonList.push([
        {
          text: `${adminPair[0].user.first_name} ${
            adminPair[0].user.last_name || ""
          }`,
          callback_data: adminPair[0].user.id,
        },
        {
          text: `${adminPair[1].user.first_name} ${
            adminPair[1].user.last_name || ""
          }`,
          callback_data: adminPair[1].user.id,
        },
      ]);
      // If the pair has one admin, create a button for that admin alone
    } else if (adminPair.length == 1) {
      adminButtonList.push([
        {
          text: `${adminPair[0].user.first_name} ${
            adminPair[0].user.last_name || ""
          }`,
          callback_data: adminPair[0].user.id,
        },
      ]);
    }
  });
  ctx.reply(
    `Alright, let's get on with it. Make sure that the person you wanna add as a bot admin is an admin of this group.If not, please make them an admin first.\n\nsend /abort to abort the operation`,
    {
      parse_mode: "Markdown",
      reply_markup: { inline_keyboard: adminButtonList },
    }
  );
  ctx.state.commandUser = ctx.from; // Store the user who initiated the command
});

addAdminScene.on("callback_query", async (ctx) => {
    // Check if the user is the owner or an admin or the user who initiated the command
    if (
      ctx.from.id != db.owner &&
      !db.admins.includes(ctx.from.id) &&
      ctx.from.id != ctx.state.commandUser.id
    ) {
      ctx.reply("NOT AUTHORISED!");
      return ctx.scene.leave();
    }

    // Add the selected admin's ID to the database
    db.admins.push(parseInt(ctx.callbackQuery.data));
    updateDB(db);

    ctx.reply(
      `Wokay ${ctx.callbackQuery.from.first_name}, the admin has been successfully added!`
    );
    ctx.scene.leave();
  await ctx.answerCbQuery();
});

module.exports = addAdminScene;
