const CreateDhlShipmentUseCase = require("../usecases/shipment/CreateDhlShipmentUseCase");
const CreateBookingUseCase = require("../usecases/booking/CreateBookingUseCase");
const ServerResponse = require("../../../utils/response");
const FileManager = require("../../../services/FileManager");
const bookingRepository = require("../repository/booking_repo");
// services
const EmailService = require("../../../services/EmailService");

class BookingController {
  async createBooking(req, res, next) {
    try {
      const data = req.body;
      const { shipmentData, contactData } =
        await CreateDhlShipmentUseCase.execute(data);
      data.bookingData = {};
      data.bookingData.packages = data.content.packages;
      data.bookingData.description = data.content.description;
      data.bookingData.number_items = data.content.packages.length;
      data.bookingData.delivery_info = contactData;
      data.bookingData.customerId = req.user
        ? req.user.userId
        : req.reqState.id;
      data.bookingData.declaredValue = data.declaredValue;
      data.bookingData.channel = req.user
        ? req.user.channel
        : req.reqState.channel;
      data.bookingData.environment = req.reqState
        ? req.reqState.environment
        : null;
      const result = await CreateBookingUseCase.execute(
        data.bookingData,
        shipmentData
      );
      if (req.user) {
        const ab = FileManager.base64ToArrayBuffer(
          result.shipmentMeta.documents[0].content
        );
        await EmailService.send({
          from: process.env.MAIL_SENDER_EMAIL,
          to: req.user.email,
          subject: "Your booking was successful",
          template: "booking",
          payload: {
            "v:name": `${req.user.firstname} ${req.user.lastname}`,
            "v:tracking": result.shipmentMeta.trackingId,
            attachment: Buffer.from(new Uint8Array(ab)),
          },
        });
        ServerResponse.message("success")
          .success(true)
          .statusCode(200)
          .data(result)
          .respond(res);
      } else {
        ServerResponse.message("success")
          .success(true)
          .statusCode(200)
          .data({
            tracking: result.shipmentMeta.trackingId,
            attachment: result.shipmentMeta.documents[0].content,
          })
          .respond(res);
      }
    } catch (err) {
      next(err);
    }
  }

  async downloadDocs(req, res, next) {
    try {
      const { id } = req.query;
      if (!id)
        return ServerResponse.message("id is a required query parameter")
          .success(false)
          .statusCode(400)
          .respond(res);
      const booking = await bookingRepository.findById(id);
      const ab = FileManager.base64ToArrayBuffer(
        booking.shipmentMeta.documents[0].content
      );
      ServerResponse.message("download successful")
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
