const stationsDao = require('../daos/stations.dao');

const getStations = async (req, res) => {
  // get data from query and params
  const { at } = req.query;

  const result = await stationsDao.getStations({ at });

  res.json(result);
};

const getStation = async (req, res) => {
  // get data from query and params
  const { at, from, to, frequency = 'hourly' } = req.query;
  const { kioskId } = req.params;

  const result = await stationsDao.getStation({ at, from, to, frequency, kioskId });

  res.json(result);
};

module.exports = {
  getStations,
  getStation,
};
