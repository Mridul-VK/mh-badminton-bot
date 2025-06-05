const getFiles = require("../utils/getFiles");
const fileNames = getFiles("../utils");

const utilHandler = async () => {
    let utils = {}
    for (let fileName of fileNames) {
        let utilFile = await require((fileName));
        utils[fileName.split("\\").pop().split(".")[0]] = utilFile;
    }
    return utils;
}
utilHandler().then((result) => {
    utils = result;
    module.exports = utils;
});