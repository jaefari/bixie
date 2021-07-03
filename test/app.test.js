/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-expressions */
const supertest = require('supertest');
const { expect } = require('chai');
const { makeDb, clearDbCollection, closeDb } = require('../utils/mongodb');

const config = require('../config');
const app = require('../app');

const template = (date) => ({
  at: new Date(date),
  stations: {
    features: [
      { properties: { kioskId: 3004 } },
      { properties: { kioskId: 3005 } },
    ],
  },
  weather: {},
});

describe('e2e', () => {
  let request;
  let db;
  before(async () => {
    request = supertest.agent(app);
    db = await makeDb();
  });

  afterEach(async () => {
    await clearDbCollection(config.MONGODB_STATIONS_COLLECTION);
  });

  after(() => {
    app.close(async () => {
      await closeDb();
    });
  });

  describe('/stations', () => {
    it('return the first snapshot of all stations', async () => {
      const dateTimes = [
        '2018-01-01T01:01:00Z',
        '2018-01-01T00:02:00Z',
        '2018-01-01T00:01:00Z',
      ];
      const data = dateTimes.map((dateTime) => template(dateTime));
      const seedingResult = await db.collection(config.MONGODB_STATIONS_COLLECTION).insertMany(data);

      const res = await request.get(`${config.API_PREFIX}/stations`).query({ at: dateTimes[2] });

      expect(res.status).to.equal(200);
      expect(res.body).not.to.be.empty;
      expect(res.body).to.be.an('object');
      expect(res.body._id).to.eq(seedingResult.insertedIds[2].toString());
    });
  });

  describe('/stations/{kioskId}', () => {
    it('return the first snapshot of the specified station for at', async () => {
      const dateTimes = [
        '2018-01-01T00:02:00Z',
        '2018-01-01T00:01:00Z',
      ];
      const data = dateTimes.map((dateTime) => template(dateTime));
      const seedingResult = await db.collection(config.MONGODB_STATIONS_COLLECTION).insertMany(data);

      const res = await request.get(`${config.API_PREFIX}/stations/3004`).query({ at: dateTimes[1] });

      expect(res.status).to.equal(200);
      expect(res.body).not.to.be.empty;
      expect(res.body).to.be.an('object');
      expect(res.body._id).to.eq(seedingResult.insertedIds[1].toString());
      expect(res.body.stations.features.properties.kioskId).to.eq(3004);
    });

    it('return the first snapshot of the specified station for from, to, frequency = hourly', async () => {
      const dateTimes = [
        '2019-01-01T00:01:00Z',
        '2018-01-01T01:01:00Z',
        '2018-01-01T00:02:00Z',
        '2018-01-01T00:01:00Z',
      ];
      const data = dateTimes.map((dateTime) => template(dateTime));
      const seedingResult = await db.collection(config.MONGODB_STATIONS_COLLECTION).insertMany(data);

      const res = await request.get(`${config.API_PREFIX}/stations/3004`).query({ from: dateTimes[3], to: dateTimes[0], frequency: 'hourly' });

      expect(res.status).to.equal(200);
      expect(res.body).not.to.be.empty;
      expect(res.body).to.be.an('array').with.lengthOf(3);
      expect(res.body[0]._id).to.eq(seedingResult.insertedIds[3].toString());
      expect(res.body[1]._id).to.eq(seedingResult.insertedIds[1].toString());
      expect(res.body[2]._id).to.eq(seedingResult.insertedIds[0].toString());
      expect(res.body[0].stations.features.properties.kioskId).to.eq(3004);
      expect(res.body[1].stations.features.properties.kioskId).to.eq(3004);
      expect(res.body[2].stations.features.properties.kioskId).to.eq(3004);
    });

    it('return the first snapshot of the specified station for from, to, frequency = daily', async () => {
      const dateTimes = [
        '2019-01-01T00:01:00Z',
        '2018-01-01T01:01:00Z',
        '2018-01-01T00:02:00Z',
        '2018-01-01T00:01:00Z',
      ];
      const data = dateTimes.map((dateTime) => template(dateTime));
      const seedingResult = await db.collection(config.MONGODB_STATIONS_COLLECTION).insertMany(data);

      const res = await request.get(`${config.API_PREFIX}/stations/3004`).query({ from: dateTimes[3], to: dateTimes[0], frequency: 'daily' });

      expect(res.status).to.equal(200);
      expect(res.body).not.to.be.empty;
      expect(res.body).to.be.an('array').with.lengthOf(2);
      expect(res.body[0]._id).to.eq(seedingResult.insertedIds[3].toString());
      expect(res.body[1]._id).to.eq(seedingResult.insertedIds[0].toString());
      expect(res.body[0].stations.features.properties.kioskId).to.eq(3004);
      expect(res.body[1].stations.features.properties.kioskId).to.eq(3004);
    });
  });
});
