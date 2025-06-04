// Simple HTTP server to keep the bot alive on platforms

let http = require("http");
http
  .createServer(function (req, res) {
    res.write("Bot is Live!");
    res.end();
  })
  .listen(process.env.PORT || 8080);
