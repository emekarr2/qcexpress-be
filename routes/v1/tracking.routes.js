const { Router } = require('express');
const TrackingController = require('../../app/tracking/controller');

const router = Router();

router.get('/single', TrackingController.trackShipment);

module.exports = router;
