// Utility to reset all slots and bookings for a new day
const db = require("../db.json");
const updateDB = require("./updateDB")

// Resets slots and bookings, optionally for a provided date
module.exports = resetSlots = (today) => {
  let currentDatetime = today ? today : new Date();
  // Set the time to 15:30:00.000 for the new day
  currentDatetime.setHours(15);
  currentDatetime.setMinutes(30);
  currentDatetime.setSeconds(0);
  currentDatetime.setMilliseconds(0);
  // Create empty slots for the day
  let slots = createEmptySlots(currentDatetime);
  let bookings = {};
  // Initialize bookings for each slot
  slots.forEach((slotPair) => {
    bookings[slotPair[0]] = { name: "", id: "" };
    if (slotPair[1]) bookings[slotPair[1]] = { name: "", id: "" };
  });
  // Update the db object with new slots and bookings
  db.currentDatetime = currentDatetime;
  db.slots = slots;
  db.bookings = bookings;
  updateDB(db);
  return { currentDatetime, slots, bookings };
};
