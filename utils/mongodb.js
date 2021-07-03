/* eslint-disable consistent-return */
const log = require('debug')('app:utils:database');
const { MongoClient } = require('mongodb');

const config = require('../config');

let client;
let db;

const makeDb = async ({ MONGODB_URL = config.MONGODB_URL, MONGODB_DBNAME = config.MONGODB_DBNAME } = {}) => {
  try {
    if (!client) client = new MongoClient(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    if (!client.isConnected()) await client.connect();
    if (!db) db = client.db(MONGODB_DBNAME);

    return db;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('❌ dataabse is not connected', error); // even if it's not in debug mode inform via stdout
    log('❌ dataabse is not connected', error);
  }
};

const closeDb = async () => {
  await client.close();
};

// clear collection, mainly used in tests
const clearDbCollection = async (collection) => {
  if (client.isConnected()) return db.collection(collection).deleteMany({});
};

module.exports = {
  makeDb,
  closeDb,
  clearDbCollection,
};
