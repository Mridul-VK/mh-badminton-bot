// Command handler loader: dynamically loads and registers all command modules
const { getFiles } = require("./utils");
const fileNames = getFiles("../commands");

// Registers each command module with the bot
const handler = (bot) => {
  for (let fileName of fileNames) {
    let commandFile = require(fileName);
    commandFile = commandFile.default ? commandFile.default : commandFile
    bot.command(commandFile.name, commandFile.callback);
  }
};

module.exports = handler;
