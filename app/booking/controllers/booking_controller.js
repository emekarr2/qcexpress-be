const CreateDhlShipmentUseCase = require("../usecases/shipment/CreateDhlShipmentUseCase");
const CreateBookingUseCase = require("../usecases/booking/CreateBookingUseCase");
const ServerResponse = require("../../../utils/response");
const FileManager = require("../../../services/FileManager");
const bookingRepository = require("../repository/booking_repo");
// services
const EmailService = require("../../../services/EmailService");
const GetPriceUseCase = require("../../prices/usecases/GetPriceUseCase");
const CustomError = require("../../../errors/error");
const RegionService = require("../../../services/RegionService");

class BookingController {
  async createBooking(req, res, next) {
    try {
      const data = req.body;
      const price = await GetPriceUseCase.execute({
        plannedShippingDateAndTime: data.plannedShippingDateAndTime,
        deliveryType: data.deliveryType,
        document: data.document,
        packages: (function parsePackges() {
          const packages = [...data.content.packages];
          return packages.map((p) => {
            delete p.description;
            return p;
          });
        })(),
        customerDetails: {
          shipperDetails: data.sender.postalAddress,
          receiverDetails: data.receiver.postalAddress,
        },
      });
      const { shipmentData, contactData } =
        await CreateDhlShipmentUseCase.execute(data);
      data.bookingData = {};
      data.bookingData.bookingCost = price;
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
      data.bookingData.environment = process.env.ENVIRONMENT;
      data.bookingData.document = data.document;
      const result = await CreateBookingUseCase.execute(
        data.bookingData,
        shipmentData
      );
      if (req.user) {
        const ab = FileManager.base64ToArrayBuffer(
          result.shipmentMeta.documents[0].content
        );

        await EmailService.sendNodemailer(
          req.user.email,
          "Your booking was successful",
          {
            header: "Verify your account using this OTP",
            name: req.user.firstname,
            body: `Dear ${req.user.firstname} ${req.user.lastname} your booking on QC express was successful.\n
        Tracking ID - ${result.shipmentMeta.trackingId}`,
            "header-body": "",
          },
          Buffer.from(new Uint8Array(ab))
        );
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
      // const ab = FileManager.base64ToArrayBuffer(
      //   booking.shipmentMeta.documents[0].content
      // );
      ServerResponse.message("download successful")
        .success(true)
        .statusCode(200)
        // .data(Buffer.from(new Uint8Array(ab)))
        .data(booking.shipmentMeta.documents)
        .respond(res);
    } catch (err) {
      next(err);
    }
  }

  async fetchRegion(req, res, next) {
    try {
      const state = req.query.state;
      if (!state) {
        throw new CustomError("state is required", 400);
      }
      const foundState = RegionService.states.find((s) => {
        return s.state.toLocaleLowerCase() == state.toLowerCase();
      });
      if (!foundState) throw new CustomError(`State ${state} not found`, 404);

      ServerResponse.message("state data fetched")
        .success(true)
        .statusCode(200)
        .data(foundState)
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
      const bookings = await bookingRepository.findManyByFields(
        {
          ...query,
          customerId: req.admin.business,
          environment: req.body.environment,
          channel: "api",
        },
        {
          select: "-shipmentMeta.documents",
          page: req.query.page,
          limit: req.query.limit,
        }
      );
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
