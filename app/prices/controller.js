const DhlService = require('../../services/DhlService');
const ServerResponse = require('../../utils/response');

class PriceController {
	async fetchSingleItemPrice(req, res) {
		const response = await DhlService.fetchDomesticRate(req.body);
		ServerResponse.message('prices fetched')
			.statusCode(200)
			.data(response)
			.respond(res);
	}
}

module.exports = Object.freeze(new PriceController());
