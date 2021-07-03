const router = require('express').Router();
const stationsController = require('../controllers/stations.controller');

/**
 * @openapi
 *  /stations:
 *    get:
 *      description: get stations by time
 *      tags: [Stations]
 *      parameters:
 *        - in: query
 *          name: at
 *          schema:
 *            type: string
 *            format: date-time
 *          required: true
 *          description: date-time of snapshot
 *          example: "2018-01-01T00:01:00Z"
 *      responses:
 *        200:
 *          description: Returns stattions
 */
router.get('/', stationsController.getStations);

/**
 * @openapi
 *  /stations/{kioskId}:
 *    get:
 *      description: get stations from to
 *      tags: [Stations]
 *      parameters:
 *        - in: query
 *          name: at
 *          schema:
 *            type: string
 *            format: date-time
 *          description: date-time of snapshot. <br /> **If you fill <u>at</u>, values of <u>from</u>, <u>to</u> and <u>frequency</u> will be ignored**
 *          example: "2018-01-01T00:01:00Z"
 *        - in: query
 *          name: from
 *          schema:
 *            type: string
 *            format: date-time
 *          description: date-time of snapshot
 *          example: "2018-01-01T00:01:00Z"
 *        - in: query
 *          name: to
 *          schema:
 *            type: string
 *            format: date-time
 *          description: date-time of snapshot
 *          example: "2020-01-01T00:01:00Z"
 *        - in: query
 *          name: frequency
 *          schema:
 *            type: string
 *            enum: [hourly, daily]
 *            default: hourly
 *          description: frequency
 *        - in: path
 *          name: kioskId
 *          schema:
 *            type: integer
 *          required: true
 *          description: kioskId of the station
 *          example: 3004
 *      responses:
 *        200:
 *          description: Returns stattions
 */
router.get('/:kioskId', stationsController.getStation);

module.exports = router;
