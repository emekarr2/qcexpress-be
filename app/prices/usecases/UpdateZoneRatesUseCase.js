const zoneRateValidator = require("../validators/zoneRateValidators");
const CustomError = require("../../../errors/error");
const zoneRateRepo = require("../repository/zone_rate_repo");

class UpdateZoneRatesUseCase {
  constructor() {
    this.zoneRateValidator = zoneRateValidator;
    this.zoneRateRepo = zoneRateRepo;
  }

  async execute(id, payload) {
    const result = this.zoneRateValidator.validateUpdateNewZoneRate(payload);
    if (result.error) {
      throw new CustomError(result.error.message, 400);
    }
    return await this.zoneRateRepo.updateById(id, result.value);
  }
}

module.exports = Object.freeze(new UpdateZoneRatesUseCase());
