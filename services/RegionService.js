const CustomError = require("../errors/error");
const HttpService = require("./HttpService");
const states = require("./NGRegions");

class RegionService {
  constructor() {
    this.states = states;
  }
  searchCities(state, cityName) {
    const foundState = this.states.find((s) => {
      return s.state.toLowerCase() === state.toLowerCase();
    });
    if (!foundState)
      throw new CustomError(`County '${state}' does not exist in Nigeria`, 404);
    const cities = foundState.lgas;
    const cityExists = cities.find((lga) => {
      return lga === cityName;
    });
    if (!cityExists)
      throw new CustomError(
        `City '${cityName}' cannot be found in ${state}`,
        404
      );
  }
}

module.exports = Object.freeze(new RegionService());
