const HttpService = require("../../../../services/HttpService");
const CustomError = require("../../../../errors/error");
const validateShipment = require("../../validators/shipment_validators");
const DhlService = require("../../../../services/DhlService");
const Constants = require("../../../../utils/constants");

class CreateDhlShipment {
  #validateShipment = validateShipment;
  #DhlService = DhlService;

  async execute(data) {
    // if (type !== 'DOMESTIC') {
    // 	data.exportDeclaration = international.exportDeclaration;
    // }
    const result = this.#validateShipment.validateShipmentCreation(data);
    if (result.error) throw new CustomError(result.error.message, 400);
    const { shipmentData, contactData } = await this.#makeShipmentRequest(
      result.value,
      data.deliveryType
    );
    return {
      shipmentData: {
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
      },
      contactData,
    };
  }

  #setUpHttpService() {
    const httpService = new HttpService(process.env.DHL_URL);
    return httpService.setBasicAuth({
      username: process.env.DHL_USERNAME,
      password: process.env.DHL_PASSWORD,
    });
  }

  #constructPayload(data, type) {
    if (type === "domestic") {
      return this.#DhlService.fetchDomesticShipmentPayload(data);
    } else if (type === "export") {
      return this.#DhlService.fetchExportShipmentPayload(
        data,
        data.document === "document" ? "D" : "P"
      );
    } else if (type === "import") {
      return this.#DhlService.fetchImportShipmentPayload(
        data,
        data.document === "document" ? "D" : "P"
      );
    } else {
      throw new CustomError("invalid shipment type selected", 400);
    }
  }

  async #makeShipmentRequest(data, type) {
    const httpService = this.#setUpHttpService();
    const payload = this.#constructPayload(data, type);
    const contactData = JSON.stringify(payload.customerDetails);
    delete payload.customerDetails.shipperDetails?.type;
    delete payload.customerDetails.receiverDetails?.type;
    delete payload.customerDetails.importerDetails?.type;
    delete payload.customerDetails.exporterDetails?.type;
    return {
      contactData: Object.values(JSON.parse(contactData)),
      shipmentData: await httpService.post("/shipments", payload),
    };
  }
}

module.exports = Object.freeze(new CreateDhlShipment());
