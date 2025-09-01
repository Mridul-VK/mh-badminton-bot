const { isAdmin } = require("../../utils");

module.exports = {
  name: "list_admins",
  desc: "Enlists current admins",
  isAdmin: true,
  callback: async (ctx) => {
    try {
      const res = await isAdmin(ctx);
      if (!res) return;
      const { admins } = res;
      if (!admins.length)
        return ctx.reply(
          "Hmm... It appears that there aren't any admins at the moment. Maybe add a few, you won't be able to manage it alone anyways 😜"
        );
      const adminNames = admins.map(
        (admin, index) =>
          `${index + 1}. [${admin.name}](tg://user?id=${admin.user_id})`
      );
      await ctx.reply(
        `🚨 *CURRENT ADMINS* 🚨\n${"-".repeat(29)}\n${adminNames.join(
          "\n"
        )}\n\nUse /add\\_admin to add an admin or /remove\\_admin to remove one.`,
        { parse_mode: "Markdown" }
      );
    } catch (error) {
      console.log("Some error occured while enlisting the admins");
    }
  },
};
