const CreateDhlShipmentUseCase = require('../usecases/shipment/CreateDhlShipmentUseCase');
const CreateBookingUseCase = require('../usecases/booking/CreateBookingUseCase');
const ServerResponse = require('../../../utils/response');

class BookingController {
	async createBooking(req, res, next) {
		try {
			const data = req.body;
			const shipmentData = await CreateDhlShipmentUseCase.execute(
				data.shipmentData,
			);
			data.bookingData.packages = data.shipmentData.packages;
			data.bookingData.description = data.shipmentData.description;
			data.bookingData.number_items = data.bookingData.packages.length;
			data.bookingData.delivery_info = data.shipmentData.receiver;
			data.bookingData.userId = req.user.userId;
			const result = await CreateBookingUseCase.execute(
				data.bookingData,
				shipmentData,
			);
			ServerResponse.message('success').success(true).data(result).respond(res);
		} catch (err) {
			next(err);
		}
	}
}

module.exports = Object.freeze(new BookingController());
