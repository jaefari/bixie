const stationsDao = require('../daos/stations.dao');
const { atSchema, fromToFrequencyKioskIdSchema, atKioskIdSchema } = require('../validation/schemas');
const validator = require('../validation/validator');

const getStations = async (req, res) => {
  // get data from query and params
  const { at } = req.query;

  // validate inputs and create validatedInput
  let validatedInput;
  try {
    validatedInput = await validator({ at }, atSchema);
  } catch (error) {
    error.status = 422;
    throw error;
  }

  const result = await stationsDao.getStations(validatedInput);

  // if result is empty return 404
  if (!result) {
    const error = new Error('data not found');
    error.status = 404;
    throw error;
  }

  res.json(result);
};

const getStation = async (req, res) => {
  // get data from query and params
  const { at, from, to, frequency = 'hourly' } = req.query;
  const { kioskId } = req.params;

  // validate inputs and create validatedInput
  let validatedInput;
  try {
    if (at) validatedInput = await validator({ at, kioskId }, atKioskIdSchema);
    else validatedInput = await validator({ from, to, frequency, kioskId }, fromToFrequencyKioskIdSchema);
  } catch (error) {
    error.status = 422;
    throw error;
  }

  const result = await stationsDao.getStation(validatedInput);

  // if result is empty return 404
  if (!result) {
    const error = new Error('data not found');
    error.status = 404;
    throw error;
  }

  res.json(result);
};

module.exports = {
  getStations,
  getStation,
};
