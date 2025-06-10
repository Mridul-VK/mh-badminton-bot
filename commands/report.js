module.exports = {
    name: "report",
    desc: "Report an issue",
    isAdmin: false,
    callback: (ctx) => {
        ctx.scene.enter("REPORT_SCENE");
    }
};