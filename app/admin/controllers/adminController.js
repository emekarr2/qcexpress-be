const CreateAdminUseCase = require("../usecases/CreateAdminUseCase");
const adminRepo = require("../repository/admin_repo");
const userRepo = require("../../user/repository/user_repo");
const onboardingRequestRepo = require("../../business/repository/onboarding_request_repo");
const bookingRepo = require("../../booking/repository/booking_repo");
const DhlService = require("../../../services/DhlService");

// utils
const ServerResponse = require("../../../utils/response");
const LoginAdmindUseCase = require("../../authentication/usecases/Authentication/Admin/LoginAdmindUseCase");
const DeleteAdminUseCase = require("../usecases/DeleteAdminUseCase");
const Booking = require("../../booking/model/Booking");
const CustomError = require("../../../errors/error");

class AdminController {
  async createAdmin(req, res, next) {
    try {
      const payload = req.body;
      const result = await CreateAdminUseCase.execute(payload);
      ServerResponse.message("admin created. send login details to admin")
        .data(result)
        .success(true)
        .statusCode(201)
        .respond(res);
    } catch (err) {
      next(err);
    }
  }

  async fetchAdmins(req, res, next) {
    try {
      const admins = await adminRepo.findManyByFields(
        {},
        { page: req.query.page, limit: req.query.limit }
      );
      ServerResponse.message("admins fetched")
        .data(admins)
        .statusCode(200)
        .success(true)
        .respond(res);
    } catch (err) {
      next(err);
    }
  }

  async loginAdmin(req, res, next) {
    try {
      const payload = req.body;
      const result = await LoginAdmindUseCase.execute(payload);
      ServerResponse.message("login successful")
        .data(result)
        .success(true)
        .statusCode(200)
        .respond(res);
    } catch (err) {
      next(err);
    }
  }

  async deleteAdmin(req, res, next) {
    try {
      const payload = req.body;
      const result = await DeleteAdminUseCase.execute(payload);
      ServerResponse.message("delete successful")
        .success(true)
        .statusCode(200)
        .respond(res);
    } catch (err) {
      next(err);
    }
  }

  async fetchKPIs(req, res, next) {
    try {
      const [userCount, bookingCount, topBooking, totalCost] =
        await Promise.all([
          userRepo.count({}),
          bookingRepo.count({}),
          Booking.find({}).limit(5).sort({ $natural: -1 }),
          Booking.aggregate([
            {
              $group: {
                _id: null,
                totalCost: { $sum: "$bookingCost" },
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
          userCount,
          bookingCount,
          topBooking,
          trackingResult,
          totalCost: totalCost[0].totalCost,
        })
        .statusCode(200)
        .respond(res);
    } catch (err) {
      next(err);
    }
  }

  async fetchBookings(req, res, next) {
    try {
      const { page, limit } = req.query;
      const bookings = await bookingRepo.findManyByFields({}, { limit, page });
      ServerResponse.message("bookings fetched")
        .data(bookings)
        .statusCode(200)
        .respond(res);
    } catch (err) {
      next(err);
    }
  }

  async fetchUsers(req, res, next) {
    try {
      const { page, limit } = req.query;
      const users = await userRepo.findManyByFields({}, { limit, page });
      ServerResponse.message("users fetched")
        .data(users)
        .statusCode(200)
        .respond(res);
    } catch (err) {
      next(err);
    }
  }

  async fetchBookingsStatus(req, res, next) {
    try {
      const { page, limit, id } = req.query;
      let bookings;
      if (id) {
        bookings = [await bookingRepo.findById(id)];
      } else {
        bookings = (await bookingRepo.findManyByFields({}, { limit, page }))
          .docs;
      }
      const bookingTrackingPromise = bookings.map((booking) => {
        return DhlService.trackShipment(booking.shipmentMeta.trackingId);
      });
      const trackingResult = await Promise.all(bookingTrackingPromise);
      ServerResponse.message("bookings fetched")
        .data(trackingResult)
        .statusCode(200)
        .respond(res);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = Object.freeze(new AdminController());
