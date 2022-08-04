const DhlService = require('../../services/DhlService');
const ServerResponse = require('../../utils/response');

class TrackingController {
	async trackShipment(req, res) {
		const { id } = req.query;
		if (!id)
			return ServerResponse.message('id is a required query parameter')
				.success(false)
				.statusCode(400)
				.respond(res);
		const response = await DhlService.trackShipment(id);
		ServerResponse.message('tracking data fetched').data(response).respond(res);
	}
}

module.exports = Object.freeze(new TrackingController());
