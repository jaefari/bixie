const router = require('express').Router();
const stationsController = require('../controllers/stations.controller');

router.get('/', stationsController.getStations);

router.get('/:kioskId', stationsController.getStation);

module.exports = router;
