const zoneRateValidator = require("../validators/zoneRateValidators");
const CustomError = require("../../../errors/error");
const zoneR

class CreateZoneRatesUseCase {
  constructor() {
    this.zoneRateValidator = zoneRateValidator;
  }

  async execute(payload) {
    const result = this.zoneRateValidator.validateCreateNewZoneRate(payload);
    if (result.error) {
      throw new CustomError(result.error.message, 400);
    }

  }
}

module.exports = Object.freeze(new CreateZoneRatesUseCase());
