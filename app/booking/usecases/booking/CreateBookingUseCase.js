const BookingRepo = require("../../repository/booking_repo");
const bookingValidation = require("../../validators/booking_validators");
const CustomError = require("../../../../errors/error");

class CreateBookingUseCase {
  #bookingRepo = BookingRepo;
  #bookingValidation = bookingValidation;

  async execute(data, shipmentMeta) {
    data.shipmentMeta = shipmentMeta;
    const result = this.#bookingValidation.validateBooking(data);
    if (result.error) throw new CustomError(result.error.message, 400);
    return await this.#bookingRepo.createEntry(result.value);
  }
}

module.exports = Object.freeze(new CreateBookingUseCase());
