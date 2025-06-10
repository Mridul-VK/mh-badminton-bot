// Utility to recursively get all file paths in a directory
const fs = require("fs");
const path = require("path");

/* This code snippet is defining a function named `getFiles` that recursively retrieves all file paths
within a specified directory. Here's a breakdown of what the code is doing: */
module.exports = getFiles = (pathName) => {
  /* The line `let fileNames = fs.readdirSync(path.join(__dirname, pathName), { withFileTypes: true
  });` is using the Node.js `fs` module to synchronously read the contents of a directory specified
  by the `pathName` parameter. */
  let fileNames = fs.readdirSync(path.join(__dirname, pathName), {
    withFileTypes: true,
  });

  /* This code snippet is a recursive function that iterates over the files and directories within a
  specified directory. Here's a breakdown of what it does: */
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
