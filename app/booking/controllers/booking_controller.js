const CreateDhlShipmentUseCase = require('../usecases/shipment/CreateDhlShipmentUseCase');
const CreateBookingUseCase = require('../usecases/booking/CreateBookingUseCase');
const ServerResponse = require('../../../utils/response');
const FileManager = require('../../../services/FileManager');
const bookingRepository = require('../repository/booking_repo');

class BookingController {
	async createBooking(req, res, next) {
		try {
			const data = req.body;
			const { shipmentData, contactData } =
				await CreateDhlShipmentUseCase.execute(
					data.shipmentData,
					data.type,
					data.international,
				);
			data.bookingData.packages = data.shipmentData.packages;
			data.bookingData.description = data.shipmentData.description;
			data.bookingData.number_items = data.bookingData.packages.length;
			data.bookingData.delivery_info = contactData;
			data.bookingData.userId = req.user.userId;
			const result = await CreateBookingUseCase.execute(
				data.bookingData,
				shipmentData,
			);
			ServerResponse.message('success')
				.success(true)
				.statusCode(200)
				.data(result)
				.respond(res);
		} catch (err) {
			next(err);
		}
	}

	async downloadDocs(req, res, next) {
		try {
			const { id } = req.query;
			if (!id)
				return ServerResponse.message('id is a required query parameter')
					.success(false)
					.statusCode(400)
					.respond(res);
			const booking = await bookingRepository.findById(id);
			const ab = FileManager.base64ToArrayBuffer(
				booking.shipmentMeta.documents[0].content,
			);
			ServerResponse.message('download successful')
				.success(true)
				.statusCode(200)
				.data(Buffer.from(new Uint8Array(ab)))
				.respond(res);
		} catch (err) {
			next(err);
		}
	}
}

module.exports = Object.freeze(new BookingController());
