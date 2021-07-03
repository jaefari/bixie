const schedule = require('node-schedule');
const axios = require('axios');

const log = require('debug')('app:utils:periodicSnapshotDownloader');
const config = require('../config');
const { makeDb } = require('./mongodb');

// every first minute of the each hour run this scheduled task
const rule = new schedule.RecurrenceRule();
rule.minute = 0;

schedule.scheduleJob(rule, async () => {
  const dateTime = new Date();
  try {
    // call endPoints to get the data from external APIs
    const result = await Promise.all([
      axios({ method: 'get', url: config.STATIONS_SERVICE_URL }),
      axios({ method: 'get', url: config.WEATHER_SERVICE_URL, params: { q: 'philadelphia', appid: config.WEATHER_SERVICE_APPID } }),
    ]);
    const stations = result[0].data;
    const weather = result[1].data;

    const db = await makeDb();
    await db.collection(config.MONGODB_STATIONS_COLLECTION).insertOne({ stations, weather, at: dateTime });

    log(`snapshot downloaded, dateTime: ${dateTime.getTime()}`);
  } catch (error) {
    log(`snapshot download failed, dateTime: ${dateTime.getTime()}, error: ${error}`);
  }
});
