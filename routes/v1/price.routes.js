const { Router } = require('express');
const PriceController = require('../../app/prices/controller');

const router = Router();

router.post('/single', PriceController.fetchSingleItemPrice);

module.exports = router;
