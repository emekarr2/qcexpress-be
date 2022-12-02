const CustomError = require("../errors/error");
const HttpService = require("./HttpService");

class RegionService {
  constructor() {
    this.HttpService = new HttpService("https://locus.fkkas.com/api/regions");
  }
  async searchCities(state, cityName) {
    const citiesResult = await this.HttpService.get(`/${state}`);
    const cities = citiesResult.data;
    if (!cities)
      throw new CustomError(`County '${state}' does not exist in Nigeria`, 404);
    const cityExists = cities.find((city) => {
      return city.name === cityName;
    });
    if (!cityExists)
      throw new CustomError(
        `City '${cityName}' cannot be found in ${state}`,
        404
      );
  }
}

module.exports = Object.freeze(new RegionService());
