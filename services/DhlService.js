const HttpService = require("./HttpService");

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
    productCode = "N",
  }) {
    const payload = await this.#httpService.post(`/rates`, {
      plannedShippingDateAndTime,
      productCode,
      payerCountryCode: "NG",
      unitOfMeasurement: "metric",
      isCustomsDeclarable,
      nextBusinessDay,
      customerDetails,
      monetaryAmount,
      accounts: [
        {
          number: process.env.DHL_ACCOUNT_NUMBER,
          typeCode: "shipper",
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
    const rate = payload.products.find((p) => {
      return p.productCode === "P";
    });
    return {
      exchangeRates: payload.exchangeRates,
      products: {
        weight: rate.weight,
        totalPrice: rate.totalPrice,
      },
    };
  }

  async fetchDocumentRate({
    originCityName,
    destinationCountryCode,
    originCountryCode,
    originPostalCode,
    destinationCityName,
    destinationPostalCode,
    weight,
    length,
    width,
    height,
    plannedShippingDate,
    isCustomsDeclarable,
    nextBusinessDay,
  }) {
    const payload = await this.#httpService.get(
      `/rates?accountNumber=${process.env.DHL_ACCOUNT_NUMBER}&originCountryCode=${originCountryCode}&originPostalCode=${originPostalCode}&originCityName=${originCityName}&destinationCountryCode=${destinationCountryCode}&destinationPostalCode=${destinationPostalCode}&destinationCityName=${destinationCityName}&weight=${weight}&length=${length}&width=${width}&height=${height}&plannedShippingDate=${plannedShippingDate}&isCustomsDeclarable=${isCustomsDeclarable}&unitOfMeasurement=metric&nextBusinessDay=${nextBusinessDay}&strictValidation=false&getAllValueAddedServices=false&requestEstimatedDeliveryDate=true&estimatedDeliveryDateType=QDDF`
    );
    const rate = payload.products.find((p) => {
      return p.productCode === "D";
    });
    return {
      exchangeRates: payload.exchangeRates,
      products: {
        weight: rate.weight,
        totalPrice: rate.totalPrice,
      },
    };
  }

  async trackShipment(trackingId) {
    return await this.#httpService.get(`/shipments/${trackingId}/tracking`);
  }

  #fetchShipmentBasePayload(data) {
    return {
      plannedShippingDateAndTime: data.plannedShippingDateAndTime,
      productCode: "N",
      pickup: {
        isRequested: process.env.NODE_ENV === "production",
      },
      outputImageProperties: {
        allDocumentsInOneImage: true,
        encodingFormat: "pdf",
        imageOptions: [
          {
            templateName: "ECOM26_84_A4_001",
            typeCode: "label",
          },
          {
            templateName: "ARCH_8X4_A4_002",
            isRequested: true,
            typeCode: "waybillDoc",
            hideAccountNumber: true,
          },
        ],
      },
      accounts: [
        {
          number: process.env.DHL_ACCOUNT_NUMBER,
          typeCode: "shipper",
        },
      ],
      customerDetails: {
        shipperDetails: {
          ...data.sender,
          typeCode: "business",
          type: "CUSTOMER",
        },
        receiverDetails: {
          ...data.receiver,
          typeCode: "business",
          type: "RECIEVER",
        },
      },
      content: {
        unitOfMeasurement: "metric",
        isCustomsDeclarable: false,
        incoterm: "DAP",
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
      type: "IMPORT",
    };
    baseData.content = {
      ...baseData.content,
      isCustomsDeclarable: true,
      exportDeclaration: data.exportDeclaration,
      declaredValueCurrency: "NGN",
      declaredValue: data.declaredValue,
    };
    baseData.productCode = "P";
    baseData.outputImageProperties.imageOptions.push({
      templateName: "COMMERCIAL_INVOICE_P_10",
      invoiceType: "proforma",
      languageCode: "eng",
      isRequested: true,
      typeCode: "invoice",
    });
    return baseData;
  }

  fetchExportShipmentPayload(data) {
    const baseData = this.#fetchShipmentBasePayload(data);
    baseData.productCode = "P";
    baseData.outputImageProperties.imageOptions.push({
      templateName: "COMMERCIAL_INVOICE_P_10",
      invoiceType: "proforma",
      languageCode: "eng",
      isRequested: true,
      typeCode: "invoice",
    });
    baseData.content = {
      ...baseData.content,
      exportDeclaration: data.exportDeclaration,
      isCustomsDeclarable: true,
      declaredValueCurrency: "NGN",
      declaredValue: data.declaredValue,
    };
    return baseData;
  }
}

module.exports = Object.freeze(new DhlService());
