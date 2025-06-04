const { Client } = require("pg");

const db = new Client(process.env.DATABASE_URL);

db.connect()
    .then(() => console.log("Connected to the database"))
    .catch((err) => console.error("Database connection error:", err));

module.exports = db