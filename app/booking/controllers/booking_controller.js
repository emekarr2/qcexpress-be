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
      data.bookingData.document = data.document;
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
            attachment:
              req.query.returndoc === "true"
                ? result.shipmentMeta.documents[0].content
                : null,
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

  async fetchDeveloperDashBoardBookings(req, res, next) {
    try {
      const filter = req.body;
      let query = {};
      if (filter.count) {
        let number_items = {};
        if (filter.count.sort === "$gte") {
          number_items = {
            $gte: filter.count.value,
          };
        }
        if (filter.count.sort === "$lte") {
          number_items = {
            $lte: filter.count.value,
          };
        }
        query.number_items = number_items;
      }
      if (filter.delivery_from) {
        query.delivery_info = {
          $elemMatch: {
            type: "CUSTOMER",
            "postalAddress.cityName": filter.delivery_from,
          },
        };
      }
      if (filter.delivery_to) {
        query.delivery_info = {
          $elemMatch: {
            type: "RECIEVER",
            "postalAddress.cityName": filter.delivery_to,
          },
        };
      }
      if (filter.date) {
        query.createdAt = {
          $gte: new Date(filter.date),
        };
      }
      if (filter.user_email) {
        query.delivery_info = {
          $elemMatch: {
            type: "CUSTOMER",
            "contactInformation.email": filter.user_email,
          },
        };
      }
      const bookings = await bookingRepository.findManyByFields({
        ...query,
        customerId: req.admin.business,
        environment: process.env.ENVIRONMENT,
        channel: "api",
      });
      ServerResponse.message("filter successful")
        .success(true)
        .statusCode(200)
        .data(bookings)
        .respond(res);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = Object.freeze(new BookingController());
