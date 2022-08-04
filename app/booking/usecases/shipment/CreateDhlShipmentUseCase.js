const HttpService = require('../../../../services/HttpService');
const CustomError = require('../../../../errors/error');
const validateShipment = require('../../validators/shipment_validators');

class CreateDhlShipment {
	#validateShipment = validateShipment;

	async execute(data) {
		const result = this.#validateShipment.validateShipmentCreation(data);
		if (result.error) throw new CustomError(result.error.message, 400);
		console.log(result);
		const shipmentData = await this.#makeShipmentRequest(result.value);
		return {
			trackingId: shipmentData.shipmentTrackingNumber,
			trackingUrl: shipmentData.trackingUrl,
			packages: shipmentData.packages.map((data) => {
				return {
					referenceNumber: data.referenceNumber,
					trackingNumber: data.trackingNumber,
					trackingUrl: data.trackingUrl,
				};
			}),
			documents: shipmentData.documents.map((data) => {
				return {
					imageFormat: data.imageFormat,
					content: data.content,
				};
			}),
		};
	}

	#setUpHttpService() {
		const httpService = new HttpService(process.env.DHL_URL);
		return httpService.setBasicAuth({
			username: process.env.DHL_USERNAME,
			password: process.env.DHL_PASSWORD,
		});
	}

	#constructPayload(data) {
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
				},
				receiverDetails: {
					...data.receiver,
					typeCode: 'business',
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

	async #makeShipmentRequest(data) {
		const httpService = this.#setUpHttpService();
		const payload = this.#constructPayload(data);
		return await httpService.post('/shipments', payload);
	}
}

module.exports = Object.freeze(new CreateDhlShipment());
