const fs = require("fs");
const path = require("path");

const getBotVariable = async (variable) => {
  const botVariableData = (await getDb()).botVariables;
  return botVariableData[variable];
};

const updateBotVariable = async (variable, data) => {
  const allDB = await getDb();
  const botVariableData = allDB.botVariables;
  botVariableData[variable] = data;
  allDB.botVariables = botVariableData;
  updateDb(allDB);
};

const getBooking = async ({ user_id = undefined, slot = undefined }) => {
  const bookingData = (await getDb()).bookings;
  return bookingData.find((booking) =>
    user_id ? booking.user_id == user_id : (booking.slot = slot)
  );
};

const updateBooking = async (slot, name = "", user_id = "") => {
  const allDB = await getDb();
  let bookingData = allDB.bookings;
  const slotBlock = bookingData.find((slotObj) => {
    slotObj.slot == slot;
  });
  bookingData = bookingData.filter((slotObj) => slotObj.slot != slot);
  if (!slotBlock) {
    bookingData.push({
      name,
      user_id,
      slot,
    });
  } else {
    slotBlock.name = name;
    slotBlock.user_id = user_id;
    bookingData.push(slotBlock);
  }
  allDB.bookings = bookingData.sort((a, b) => a.slot - b.slot);
  updateDb(allDB);
};

const clearBooking = async () => {
  const allDB = await getDb();
  allDB.bookings = [];
  updateDb(allDB);
};

const getAdmin = async (admin = "") => {
  const adminData = (await getDb()).admins;
  if (admin) {
    return adminData[admin];
  } else {
    return adminData;
  }
};

const addAdmin = async (user_id, name) => {
  const AllDb = await getDb();
  AllDb.admins.push({
    user_id,
    name,
  });
  updateDb(AllDb);
};

const removeAdmin = async (user_id) => {
  const AllDb = await getDb();
  AllDb.admins = AllDb.admins.filter((admin) => admin.user_id != user_id);
  updateDb(AllDb);
};

const getDb = async () => {
  const collections = fs.readdirSync(path.resolve(__dirname, "../db"));
  const dbs = {};
  for (let collection of collections) {
    const data = fs.readFileSync(
      path.resolve(__dirname, `../db/${collection}`)
    );
    dbs[collection.split(".").shift()] = JSON.parse(data);
  }
  return dbs;
};

const updateDb = async (Db) => {
  for (let key of Object.keys(Db)) {
    fs.writeFileSync(
      path.resolve(__dirname, `../db/${key}.json`),
      JSON.stringify(Db[key], null, 2)
    );
  }
};

module.exports = {
  getBotVariable,
  getBooking,
  getAdmin,

  updateBotVariable,

  updateBooking,
  clearBooking,

  addAdmin,
  removeAdmin,

  getDb,
  updateDb,
};
