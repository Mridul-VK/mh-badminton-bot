const { Scenes, Context } = require("telegraf");
const { isAdmin } = require("../utils");

const resetScene = new Scenes.BaseScene("RESET_SCENE");

resetScene.enter(
    /**
     * @param {Context} ctx
     */
    async (ctx) => {
        try {
            const res = await isAdmin(ctx);
            if (!res) return ctx.scene.leave();

            await ctx.reply('Are you sure you wanna reset the slots? All the current bookings will be removed.\n\nuse /abort or click "No" to abort the operation', {
                reply_markup: {
                    inline_keyboard: [[
                        {
                            text: "Yes",
                            callback_data: "y"
                        },
                        {
                            text: "No",
                            callback_data: "n"
                        }
                    ]]
                }
            });

            ctx.scene.state.commandUser = ctx.from;
        } catch (error) {
            console.log("Error RESET_COMMAND_ERROR: ", error);
        }
    });

resetScene.on("callback_query",
    /**
     * @param {Context} ctx 
     */
    async (ctx) => {
        try {
            if (!ctx.callbackQuery.data) return ctx.scene.leave();
            if (ctx.scene.state.commandUser.id != ctx.from.id) {
                await ctx.reply("Only the one who used the command can respond");
            }

            await ctx.telegram.deleteMessage(
                ctx.chat.id,
                ctx.callbackQuery.message.message_id
            );

            if (ctx.callbackQuery.data == 'y') {
                await resetSlots();
                return ctx.reply("All slots have been reset successfully.");
            }
            if (ctx.callbackQuery.data == 'n') {
                await ctx.reply("slot resetting aborted!");
                return ctx.scene.leave();
            }
        } catch (error) {
            console.log("Error RESET_CALLBACK_ERROR: ", error);

        }
    });

module.exports = resetScene;