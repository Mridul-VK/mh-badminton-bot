const getFiles = require("../utils/getFiles");
const fileNames = getFiles("../scenes");

const sceneHandler = () => {
    const scenes = []
    for (let fileName of fileNames) {
        let scene = require(fileName);
        scenes.push(scene);
    }
    return scenes;
}

module.exports = sceneHandler;