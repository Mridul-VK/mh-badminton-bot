// Utility to create empty slot pairs for a given date
module.exports = createEmptySlots = (currentDatetime) => {
  // Start with the initial time as the first slot
  const slots = [currentDatetime.getTime()];
  // Generate 6 more slots, each one hour apart
  for (let i = 0; i < 6; i++) {
    slots.push(currentDatetime.setHours(currentDatetime.getHours() + 1));
  }
  // Pair the slots for easier handling
  const combinedSlots = pairSlots(slots);
  return combinedSlots;
};