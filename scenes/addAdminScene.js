const { Scenes } = require("telegraf");
const db = require("../db.js");
const { pairSlots, isAdmin, isPrivate } = require("../utils");

//Initialize the scene for collecting admin IDs
const addAdminScene = new Scenes.BaseScene("ADD_ADMIN_SCENE");

//Enter the scene when the command is triggered
addAdminScene.enter(async (ctx) => {
  await isPrivate(ctx); // Ensure the command is not used in a private chat

  // Check if the user is the owner or an admin
  let res = await isAdmin(ctx);
  if (!res) return ctx.scene.leave();
  const { admins, owner } = res;

  //get the list of admins in the group
  let groupAdmins = await ctx.getChatAdministrators(ctx.chat.id);

  // Exclude the bot itself and the user who initiated the command along with already existing admins in the db and the owner
  groupAdmins = groupAdmins.filter(
    (admin) =>
      admin.user.id != ctx.botInfo.id && !admins.find(user => user.user_id == admin.user.id) && admin.user.id != ctx.from.id && admin.user.id != owner
  );

  // Checking if the person to be added as admin is not an admin of the group
  if (groupAdmins.length == 0) {
    ctx.reply(
      "Seems like the person you're trying to add as an admin is not an admin of the group.\n\nIf you want to add a new admin, please make sure they are an admin of this group and try again.\n\nPS: No bot can be added as an admin"
    );
    return ctx.scene.leave();
  }

  // Pairing the admins into pairs for the inline keyboard
  // This is done to make the inline keyboard more user-friendly
  const pairedAdmins = pairSlots(groupAdmins);

  // Initialize the button list for the inline keyboard
  // Each button will have the admin's name and a callback data with their ID and command
  let adminButtonList = [];
  pairedAdmins.forEach((adminPair) => {
    // If the pair has two admins, create a button for each
    if (adminPair.length == 2) {
      adminButtonList.push([
        {
          text: `${adminPair[0].user.first_name} ${adminPair[0].user.last_name || ""
            }`,
          callback_data: JSON.stringify({
            id: adminPair[0].user.id,
            name: `${adminPair[0].user.first_name} ${adminPair[0].user.last_name || ""
              }`.trim(),
          }),
        },
        {
          text: `${adminPair[1].user.first_name} ${adminPair[1].user.last_name || ""
            }`,
          callback_data: JSON.stringify({
            id: adminPair[1].user.id,
            name: `${adminPair[1].user.first_name} ${adminPair[1].user.last_name || ""
              }`.trim(),
          }),
        },
      ]);
      // If the pair has one admin, create a button for that admin alone
    } else if (adminPair.length == 1) {
      adminButtonList.push([
        {
          text: `${adminPair[0].user.first_name} ${adminPair[0].user.last_name || ""
            }`,
          callback_data: JSON.stringify({
            id: adminPair[0].user.id,
            name: `${adminPair[0].user.first_name} ${adminPair[0].user.last_name || ""
              }`.trim(),
          }),
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
  ctx.scene.state.commandUser = ctx.from; // Store the user who initiated the command 
});

addAdminScene.on("callback_query", async (ctx) => {
  // If the user who initiated the command is not the same as the user who clicked the button, ignore the callback
  if (parseInt(ctx.callbackQuery.from.id) != parseInt(ctx.scene.state.commandUser.id)) {
    ctx.deleteMessage(ctx.callbackQuery.message.message_id); // Delete the message with the inline keyboard
    ctx.answerCbQuery("Only the user who initiated the command can respond.");
    return ctx.scene.leave();
  }
  ctx.callbackQuery.message ? await ctx.deleteMessage(ctx.callbackQuery.message.message_id) : null; // Delete the message with the inline keyboard

  // Add the selected admin's ID to the database
  await db.query(
    "INSERT INTO admin (user_id, name) VALUES ($1, $2) ON CONFLICT (user_id) DO UPDATE SET name = $2, user_id = $1",
    [JSON.parse(ctx.callbackQuery.data).id, JSON.parse(ctx.callbackQuery.data).name]
  );

  ctx.reply(
    `Wokay ${ctx.callbackQuery.from.first_name}, [${JSON.parse(ctx.callbackQuery.data).name}](tg://user?id=${JSON.parse(ctx.callbackQuery.data).id}) has been successfully added!`,
    { parse_mode: "Markdown" }
  );
  ctx.answerCbQuery("Operation Successful");
  return ctx.scene.leave();
});

module.exports = addAdminScene;
