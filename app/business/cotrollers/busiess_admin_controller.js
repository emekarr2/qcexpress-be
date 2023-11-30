const LoginBusinessAdminUseCase = require("../usecases/admin/LoginBusinessAdminUseCase");
const ServerResponse = require("../../../utils/response");
const businessRepo = require("../repository/buiness_repo");
const { decrypt } = require("../../../utils/encrypter");
const bookingRepo = require("../../booking/repository/booking_repo");
const Booking = require("../../booking/model/Booking");
const DhlService = require("../../../services/DhlService");

class BusinessAdminController {
  async loginBusinessAdmin(req, res, next) {
    try {
      const payload = req.body;
      const result = await LoginBusinessAdminUseCase.execute(payload);
      ServerResponse.message("admin login")
        .data(result)
        .statusCode(200)
        .success(true)
        .respond(res);
    } catch (err) {
      next(err);
    }
  }

  async exposeAPIKeys(req, res, next) {
    try {
      const business = await businessRepo.findById(req.admin.business);
      const staging_api_key = decrypt(business.staging_api_key);
      const production_api_key = decrypt(business.prod_api_key);
      ServerResponse.message("api keys decrypted")
        .data({
          production_api_key,
          staging_api_key,
        })
        .statusCode(200)
        .success(true)
        .respond(res);
    } catch (err) {
      next(err);
    }
  }

  async fetchKPIs(req, res, next) {
    try {
      const [bookingCount, topBooking, stateCount, totalValue] =
        await Promise.all([
          bookingRepo.count({
            customerId: req.admin.business,
            environment: process.env.ENVIRONMENT,
            channel: "api",
          }),
          Booking.find({
            customerId: req.admin.business,
            environment: process.env.ENVIRONMENT,
            channel: "api",
          })
            .limit(5)
            .sort({ $natural: -1 }),
          Booking.aggregate([
            {
              $match: {
                customerId: req.admin.business,
                environment: process.env.ENVIRONMENT,
                channel: "api",
              },
            },
            {
              $unwind: "$delivery_info",
            },
            {
              $group: {
                _id: "$delivery_info.postalAddress.cityName",
                count: { $sum: 1 },
              },
            },
          ]),
          Booking.aggregate([
            {
              $match: {
                customerId: req.admin.business,
                environment: process.env.ENVIRONMENT,
                channel: "api",
              },
            },
            {
              $group: {
                _id: null,
                declaredValue: { $sum: "$declaredValue" },
              },
            },
          ]),
        ]);
      const bookingTrackingPromise = topBooking.map((booking) => {
        return DhlService.trackShipment(booking.shipmentMeta.trackingId);
      });
      const trackingResult = await Promise.all(bookingTrackingPromise);
      ServerResponse.message("kpis fetched")
        .data({
          bookingCount,
          topBooking,
          trackingResult,
          stateCount,
          totalValue,
        })
        .statusCode(200)
        .respond(res);
    } catch (err) {
      next(err);
    }
  }

  async deleteSandBoxData(req, res, next) {
    try {
      await bookingRepo.deleteMany({
        customerId: req.admin.business,
        environment: "sandbox",
        channel: "api",
      });
      ServerResponse.message("delete successful")
        .success(true)
        .statusCode(200)
        .respond(res);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = Object.freeze(new BusinessAdminController());
