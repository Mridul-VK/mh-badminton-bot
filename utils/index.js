// Central export for all utility functions used throughout the project

const getFiles = require("./getFiles");
const laydownButtons = require("./laydownButtons");
const pairSlots = require("./pairSlots");
const unPairSlots = require("./unPairSlots");
const resetSlots = require("./resetSlots");
const isPrivate = require("./isPrivate");
const isAdmin = require("./isAdmin");

// Export all utilities as a single object for easy import
module.exports = {
    getFiles,
    laydownButtons,
    pairSlots,
    resetSlots,
    unPairSlots,
    isPrivate,
    isAdmin
};