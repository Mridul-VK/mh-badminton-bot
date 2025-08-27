const { getBotVariable } = require("./dbAccess");

/* This code snippet is exporting a function named `isPrivate` using `module.exports`. The function
takes a parameter `ctx` which is expected to contain information about a chat. */
module.exports = isPrivate = async (ctx) => {
  if (ctx.chat.type == "private") {
    /* The line `const res = await db.query("SELECT * FROM bot_variable WHERE key =
        'privateCommandReply'");` is querying a database table named `bot_variable` to retrieve a
        specific value. The query is looking for a row where the `key` column named`'privateCommandReply'`.
        The result of this query is stored in the variable `res`, which
        likely contains the row that matches the query criteria. */
    const res = await getBotVariable("privateCommandReply");
    return ctx.reply(res, {
      parse_mode: "HTML",
    });
  }
  return;
};
