// Command handler loader: dynamically loads and registers all command modules
const getFiles = require("../utils/getFiles");
const fileNames = getFiles("../commands");

const commands = {};
// Registers each command module with the bot
const commandHandler = (bot) => {
  for (let fileName of fileNames) {
    let commandFile = require(fileName);
    commandFile = commandFile.default ? commandFile.default : commandFile;
    bot.command(commandFile.name, commandFile.callback);
    commands[commandFile.name] = commandFile.callback;
  }
};

module.exports = { commandHandler, commands };
