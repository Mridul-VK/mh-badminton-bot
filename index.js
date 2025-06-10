// Main entry point for the MH Badminton Bot
// require("dotenv").config();
require("./keepalive.js");
const { Telegraf, Scenes, session } = require("telegraf");
const { isPrivate, resetSlots } = require("./utils");
const db = require("./db.js");
const handler = require("./handlers/commandHandler.js");
const sceneHandler = require("./handlers/sceneHandler.js");
const cron = require("node-cron");

// Initialize the Telegram bot with the provided token
const bot = new Telegraf(process.env.TOKEN);

/* The `cron.schedule()` code snippet is setting up a cron job
using the `node-cron` library in Node.js. */
cron.schedule("0 0 0 * * *", async () => {
  // Daily reset of slots at midnight
  try {
    await resetSlots();
  } catch (error) {
    console.error("Error resetting slots:", error);
  }
});

// Set up the scene manager for multi-step interactions
const stage = new Scenes.Stage(sceneHandler());
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
    const res = await db.query("SELECT * FROM bot_variable WHERE key = 'startMessage'");
    ctx.reply(res.rows[0].value);
  }
});

// Handler for the /help command
bot.help(async (ctx) => {
  await isPrivate(ctx);
  const res = await db.query("SELECT * FROM bot_variable WHERE key = 'helpMessage'");
  ctx.reply(res.rows[0].value, {
    parse_mode: "HTML",
  });
});

// Launch the bot and initialize slots/bookings
bot.launch(() => {
  console.log("Bot is up and running");
});

// Gracefully stop the bot on process termination signals
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
