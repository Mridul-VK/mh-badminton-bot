// Main entry point for the MH Badminton Bot
// require("dotenv").config();
require("./keepalive.js");
const { Telegraf, Scenes, session } = require("telegraf");
const { resetSlots, unPairSlots, pairSlots, updateDB } = require("./utils");
const db = require("./db.js");
const handler = require("./commandHandler.js");
const addAdminScene = require("./scenes/addAdminScene.js");

// Initialize the Telegram bot with the provided token
const bot = new Telegraf(process.env.TOKEN);

let slots;

// db.query('SELECT * FROM booking').then(result => console.log(result));

// Set up the scene manager for multi-step interactions
const stage = new Scenes.Stage([addAdminScene]);
bot.use(session());

// Command to abort any ongoing scene operation
stage.command("abort", (ctx) => {
  if (ctx.scene.current) {
    ctx.reply(`Alright, the operation has been aborted!`);
    ctx.scene.leave();
  } else {
    ctx.reply("There are no active operations so chill...");
  }
});
bot.use(stage.middleware());

// Activate the command handler to load and handle all commands
handler(bot);

// Handler for the /start command
bot.start(async (ctx) => {
  if (ctx.chat.type == "private") {
    // Private chat: explain committee policy
    const privateStartReply =
      "Hello there👋🏻! I'm the MH Badminton Bot 🤖. To reserve your slots for playing Badminton, you must be in MH Badminton group. It's a committee policy to make sure that you're one of the MH inmates.\n\nThank you for understanding 😊";
    ctx.reply(privateStartReply);
  } else {
    ctx.reply(db.startMessage);
  }
});

// Handler for the /help command
bot.help((ctx) => {
  if (ctx.chat.type == "private")
    return ctx.reply(db.privateCommandReply, {
      parse_mode: "HTML",
    });
  ctx.reply(db.helpMessage, {
    parse_mode: "HTML",
  });
});

// Handler for inline keyboard callback queries
bot.on("callback_query", async (ctx) => {
  // Parse callback data to determine action and slot indices
  const callbackData = JSON.parse(ctx.callbackQuery.data);
  const indices = callbackData.indices.split(",");
  // Remove the inline keyboard message after selection
  await ctx.telegram.deleteMessage(
    ctx.chat.id,
    ctx.callbackQuery.message.message_id
  );
  // Handle slot reservation
  if (callbackData.command == "reserve") {
    bookings[slots[indices[0]][indices[1]]] = {
      name: ctx.callbackQuery.from.first_name
        ? `${ctx.callbackQuery.from.first_name} ${
            ctx.callbackQuery.from.last_name
              ? ctx.callbackQuery.from.last_name
              : ""
          }`
        : "Anonymus user",
      id: ctx.callbackQuery.from.id,
    };
    // Remove the reserved slot from available slots
    slots[indices[0]].splice(indices[1], 1);
    if (!slots[indices[0]].length) {
      slots.splice(indices[0], 1);
    }
    //update db with new bookings and slots
    db.bookings = bookings;
    db.slots = slots;
    updateDB(db);

    // Send confirmation message to the user
    await ctx.telegram.sendMessage(
      ctx.chat.id,
      `Your slot has been successfully reserved!`
    );
  }

  // Handle slot cancellation
  if (callbackData.command == "cancel") {
    let userSlots = [];

    // Find all slots reserved by the user
    for (let slot in bookings) {
      bookings[slot].id == ctx.callbackQuery.from.id
        ? userSlots.push(parseInt(slot))
        : null;
    }
    userSlots.sort();
    userSlots = pairSlots(userSlots);

    // Clear the selected slot
    bookings[userSlots[indices[0]][indices[1]]] = { name: "", id: "" };

    // Add the slot back to available slots
    let currentSlots = unPairSlots(slots);
    currentSlots.push(userSlots[indices[0]][indices[1]]);
    currentSlots.sort();
    slots = pairSlots(currentSlots);

    //update db with new bookings and slots
    db.bookings = bookings;
    db.slots = slots;
    updateDB(db);

    // Send confirmation message to the user
    await ctx.reply("Your selected slot has been successfully canceled");
  }

  // Acknowledge the callback query
  ctx.telegram.answerCbQuery(ctx.callbackQuery.id);
});


// Launch the bot and initialize slots/bookings
bot.launch(() => {
  console.log("Bot is up and running");
});

// Gracefully stop the bot on process termination signals
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
