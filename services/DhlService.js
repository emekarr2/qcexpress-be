const HttpService = require('./HttpService');

class DhlService {
	#httpService = new HttpService(process.env.DHL_URL);

	constructor() {
		this.#httpService.setBasicAuth({
			username: process.env.DHL_USERNAME,
			password: process.env.DHL_PASSWORD,
		});
	}

	async fetchDomesticRate({
		length,
		width,
		weight,
		height,
		plannedShippingDateAndTime,
		isCustomsDeclarable = false,
		nextBusinessDay,
		customerDetails,
		monetaryAmount,
		productCode = 'N',
	}) {
		const payload = await this.#httpService.post(`/rates`, {
			plannedShippingDateAndTime,
			productCode,
			payerCountryCode: 'NG',
			unitOfMeasurement: 'metric',
			isCustomsDeclarable,
			nextBusinessDay,
			customerDetails,
			monetaryAmount,
			accounts: [
				{
					number: process.env.DHL_ACCOUNT_NUMBER,
					typeCode: 'shipper',
				},
			],
			packages: [
				{
					weight,
					dimensions: {
						length,
						width,
						height,
					},
				},
			],
		});
		return {
			exchangeRates: payload.exchangeRates,
			products: payload.products.map((p) => {
				return {
					weight: p.weight,
					totalPrice: p.totalPrice,
				};
			}),
		};
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
					number: process.env.DHL_ACCOUNT_NUMBER,
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
