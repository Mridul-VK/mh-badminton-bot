// Central export for all utility functions used throughout the project

const createEmptySlots = require("./createEmptySlots");
const getFiles = require("./getFiles");
const getBookingsArray = require("./getBookingsArray")
const laydownButtons = require("./laydownButtons")
const pairSlots = require("./pairSlots")
const unPairSlots = require("./unPairSlots");
const updateDB = require("./updateDB");
const resetSlots = require("./resetSlots");

// Export all utilities as a single object for easy import
module.exports = {
    getFiles,
    createEmptySlots,
    getBookingsArray,
    laydownButtons,
    pairSlots,
    resetSlots,
    unPairSlots,
    updateDB,
}