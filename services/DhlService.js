const HttpService = require('./HttpService');

class DhlService {
	#httpService = new HttpService(process.env.DHL_URL);

	constructor() {
		this.#httpService.setBasicAuth({
			username: process.env.DHL_USERNAME,
			password: process.env.DHL_PASSWORD,
		});
	}

	async getSingleItemRate({
		cityFrom,
		cityTo,
		length,
		width,
		weight,
		height,
		plannedShippingDate,
		isCustomsDeclarable = false,
		destinationCountryCode,
		originPostalCode,
		destinationPostalCode,
	}) {
		return await this.#httpService.get(`/rates`, {
			params: {
				accountNumber: '365022156',
				originCountryCode: 'CZ',
				originCityName: cityFrom,
				destinationCountryCode,
				destinationCityName: cityTo,
				originPostalCode,
				destinationPostalCode,
				weight,
				length,
				width,
				height,
				plannedShippingDate,
				isCustomsDeclarable,
				unitOfMeasurement: 'metric',
			},
		});
	}
}

module.exports = Object.freeze(new DhlService());
