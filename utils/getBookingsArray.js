// Utility to generate a formatted array of today's bookings for display
const db = require("../db.json");
const updateDB = require("./updateDB")

// Returns an array of formatted booking strings for the current day
module.exports = getBookingsArray = () => {
  let { bookings } = db;
  const bookedTimes = Object.keys(bookings);

  // Convert slot keys to integers and sort them
  bookedTimes.forEach((slot, index) => (bookedTimes[index] = parseInt(slot)));
  bookedTimes.sort();

  // Rebuild bookings object in sorted order
  const newBookingsObject = {};
  for (let slot of bookedTimes) {
    newBookingsObject[slot] = bookings[slot];
  }

  // Update the db object with the new sorted bookings
  db.bookings, bookings = newBookingsObject;
  updateDB(db)

  // Format each booking for display
  const bookingListArray = [];
  for (let slot in bookings) {
    bookingListArray.push(
      `${new Date(parseInt(slot)).toLocaleTimeString()}:\t${
        bookings[slot].name.length != 0 ? `[${bookings[slot].name}](tg://user?id=${bookings[slot].id})` : ""
      }`
    );// tg://user?id=${bookings[slot].id} is used to create a clickable link to the user's profile just like username
  }
  return bookingListArray;
};
