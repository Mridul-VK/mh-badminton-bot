// Utility to recursively get all file paths in a directory
const fs = require("fs");
const path = require("path");

// Recursively collects all file paths from the given directory
module.exports = getFiles = (pathName) => {
  let fileNames = fs.readdirSync(path.join(__dirname, pathName), {
    withFileTypes: true,
  });
  let finalFileNames = [];
  for (let fileName of fileNames) {
    if (fileName.isDirectory()) {
      // If directory, recursively get files inside
      let subFiles = getFiles(`${pathName}/${fileName.name}`);
      finalFileNames = [...finalFileNames, ...subFiles];
    } else {
      // If file, add to result
      finalFileNames = [...finalFileNames, path.join(__dirname, `${pathName}/${fileName.name}`)];
    }
  }
  return finalFileNames;
};
