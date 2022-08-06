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

	async trackShipment(trackingId) {
		return await this.#httpService.get(`/shipments/${trackingId}/tracking`);
	}

	#fetchShipmentBasePayload(data) {
		return {
			plannedShippingDateAndTime: data.plannedShippingDateAndTime,
			productCode: 'N',
			pickup: {
				isRequested: false,
			},
			outputImageProperties: {
				allDocumentsInOneImage: true,
				encodingFormat: 'pdf',
				imageOptions: [
					{
						templateName: 'ECOM26_84_A4_001',
						typeCode: 'label',
					},
					{
						templateName: 'ARCH_8X4_A4_002',
						isRequested: true,
						typeCode: 'waybillDoc',
						hideAccountNumber: true,
					},
				],
			},
			accounts: [
				{
					number: '365022156',
					typeCode: 'shipper',
				},
			],
			customerDetails: {
				shipperDetails: {
					...data.sender,
					typeCode: 'business',
					type: 'CUSTOMER',
				},
				receiverDetails: {
					...data.receiver,
					typeCode: 'business',
					type: 'RECIEVER',
				},
			},
			content: {
				unitOfMeasurement: 'metric',
				isCustomsDeclarable: false,
				incoterm: 'DAP',
				description: data.description,
				packages: data.packages,
			},
		};
	}

	fetchDomesticShipmentPayload(data) {
		return this.#fetchShipmentBasePayload(data);
	}

	fetchImportShipmentPayload(data) {
		const baseData = this.#fetchShipmentBasePayload(data);
		baseData.customerDetails.importerDetails = {
			...baseData.customerDetails.receiverDetails,
			type: 'IMPORT',
		};
		return baseData;
	}

	fetchExportShipmentPayload(data) {
		const baseData = this.#fetchShipmentBasePayload(data);
		baseData.customerDetails.exporterDetails = {
			...baseData.customerDetails.shipperDetails,
			type: 'EXPORT',
		};
		return baseData;
	}
}

module.exports = Object.freeze(new DhlService());
