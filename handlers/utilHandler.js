const getFiles = require("../utils/getFiles");
const fileNames = getFiles("../utils");

const utilHandler = () => {
    let utils = {}
    for (let fileName of fileNames) {
        let utilFile = require((fileName));
        utils[fileName.split("\\").pop().split(".")[0]] = utilFile;
    }
    return utils;
}
const utils = utilHandler()
module.exports = utils;