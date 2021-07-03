const config = require('../config');
const { makeDb } = require('../utils/mongodb');

const stationsCollectionName = config.MONGODB_STATIONS_COLLECTION;

const getStations = async ({ at }) => {
  const db = await makeDb();
  const result = await db.collection(stationsCollectionName).aggregate([
    { $match: { at: { $gte: new Date(at) } } },
    { $sort: { at: 1 } },
    { $limit: 1 },
  ]).toArray();
  return result[0];
};

const getStation = async ({ at, from, to, frequency, kioskId }) => {
  const db = await makeDb();
  if (at) {
    // only care about at, kioskId. Ignore from, to, frequency
    const result = await db.collection(stationsCollectionName).aggregate([
      { $match: { at: { $gte: new Date(at) } } },
      { $sort: { at: 1 } },
      { $limit: 1 },
      { $unwind: '$stations.features' },
      { $match: { 'stations.features.properties.kioskId': parseInt(kioskId, 10) } },
    ]).toArray();
    return result[0];
  }

  // only care about kioskId, from, to
  return db.collection(stationsCollectionName).aggregate([
    { $match: { at: { $gte: new Date(from), $lte: new Date(to) } } },
    { $sort: { at: 1 } },
    { $project: {
      at: 1,
      stations: 1,
      weather: 1,
      keyToGroupSnapshots: { $dateToString: { date: '$at', format: `%Y-%m-%d${frequency === 'hourly' ? '%H' : ''}`, timezone: 'America/New_York' } } },
    },
    { $group: { _id: '$keyToGroupSnapshots', snapshotsOfTheGroup: { $push: { _id: '$_id', at: '$at', stations: '$stations', weather: '$weather' } } } },
    { $project: { _id: 1, firstSnapshot: { $arrayElemAt: ['$snapshotsOfTheGroup', 0] } } },
    { $project: { _id: '$firstSnapshot._id', at: '$firstSnapshot.at', stations: '$firstSnapshot.stations', weather: '$firstSnapshot.weather' } },
    { $unwind: '$stations.features' },
    { $match: { 'stations.features.properties.kioskId': parseInt(kioskId, 10) } },
    { $sort: { at: 1 } },
  ]).toArray();
};

module.exports = {
  getStations,
  getStation,
};
