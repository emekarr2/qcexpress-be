const zoneRateValidator = require("../validators/zoneRateValidators");
const CustomError = require("../../../errors/error");
const zoneRateRepo = require("../repository/zone_rate_repo");

class CreateZoneRatesUseCase {
  constructor() {
    this.zoneRateValidator = zoneRateValidator;
    this.zoneRateRepo = zoneRateRepo;
  }

  async execute(payload) {
    const result = this.zoneRateValidator.validateCreateNewZoneRate(payload);
    if (result.error) {
      throw new CustomError(result.error.message, 400);
    }
    if (payload.min >= payload.max) {
      throw new CustomError("min cannot be greater or equal to max", 400);
    }
    result.value.zone = result.value.zone.charAt(0).toLowerCase() + result.value.zone.slice(1);
    return await this.zoneRateRepo.createEntry(result.value);
  }
}

module.exports = Object.freeze(new CreateZoneRatesUseCase());
