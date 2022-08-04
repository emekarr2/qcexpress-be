const DhlService = require('../../services/DhlService');
const ServerResponse = require('../../utils/response');

class PriceController {
	async fetchSingleItemPrice(req, res) {
		const response = await DhlService.getSingleItemRate(req.query);
		ServerResponse.message('prices fetched').data(response).respond(res);
	}
}

module.exports = Object.freeze(new PriceController());
