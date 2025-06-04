// Utility to update the database JSON file with the latest state
const fs = require("fs");
const path = require("path");

// Function to write the updated db object to db.json
module.exports = updateDB = (db) => {
  fs.writeFileSync(path.join(__dirname, "../db.json"), JSON.stringify(db, null, 2));
};
