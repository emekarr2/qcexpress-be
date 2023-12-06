const HttpService = require("./HttpService");

class DhlService {
  #httpService = new HttpService(process.env.DHL_URL);

  constructor() {
    this.#httpService.setBasicAuth({
      username: process.env.DHL_USERNAME,
      password: process.env.DHL_PASSWORD,
    });
  }

  /**
   * fetches non document prices. works for domestic and international
   */
  async fetchRates({
    packages,
    plannedShippingDateAndTime,
    customerDetails,
    productCode,
    deliveryType,
    document,
  }) {
    const payload = await this.#httpService.post(`/rates`, {
      plannedShippingDateAndTime,
      productCode,
      unitOfMeasurement: "metric",
      isCustomsDeclarable:
        deliveryType === "domestic" || document === "document" ? false : true,
      nextBusinessDay: true,
      customerDetails,
      estimatedDeliveryDate: {
        isRequested: true,
        typeCode: "QDDC",
      },
      accounts: [
        {
          number: process.env.DHL_ACCOUNT_NUMBER,
          typeCode: "shipper",
        },
      ],
      packages,
    });
    const rate = payload.products.find((p) => {
      return p.productCode === productCode;
    });
    return {
      exchangeRates: payload.exchangeRates,
      products: {
        weight: rate.weight,
        totalPrice: rate.totalPrice,
      },
    };
  }

  /**
   *  fetches document prices. works for only international
   */
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
    nextBusinessDay = true,
  }) {
    const payload = await this.#httpService.get(
      `/rates?accountNumber=${process.env.DHL_ACCOUNT_NUMBER}&originCountryCode=${originCountryCode}&originPostalCode=${originPostalCode}&originCityName=${originCityName}&destinationCountryCode=${destinationCountryCode}&destinationPostalCode=${destinationPostalCode}&destinationCityName=${destinationCityName}&weight=${weight}&length=${length}&width=${width}&height=${height}&plannedShippingDate=${plannedShippingDate}&isCustomsDeclarable=${isCustomsDeclarable}&unitOfMeasurement=metric&nextBusinessDay=${nextBusinessDay}&strictValidation=false&getAllValueAddedServices=false&requestEstimatedDeliveryDate=true&estimatedDeliveryDateType=QDDF`
    );
    const rate = payload.products.find((p) => {
      return p.productCode === "P";
    });
    payload.products.forEach((p) => {
      console.log(p.totalPrice, p.productCode, p.productName);
    });
    // console.log(payload.products);
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
        isRequested: data.pickup,
      },
      estimatedDeliveryDate: {
        isRequested: true,
        typeCode: "QDDC",
      },
      getAdditionalInformation: [
        {
          typeCode: "pickupDetails",
          isRequested: data.pickup,
        },
      ],
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
        description: data.content.description,
        packages: data.content.packages,
        declaredValueCurrency: "NGN",
      },
    };
  }

  fetchDomesticShipmentPayload(data) {
    return this.#fetchShipmentBasePayload(data);
  }

  fetchImportShipmentPayload(data) {
    const baseData = this.#fetchShipmentBasePayload(data);
    const date = new Date();
    baseData.content = {
      ...baseData.content,
      isCustomsDeclarable: true,
      declaredValueCurrency: "NGN",
      declaredValue: data.declaredValue,
      exportDeclaration: {
        ...data.content.exportDeclaration,
        shipmentType: "personal",
        customsDocuments: [
          {
            typeCode: "INV",
            value: "MyDHLAPI - CUSDOC-001",
          },
        ],
        invoice: {
          number: `QC-${date.getUTCSeconds()}`,
          date: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
        },
      },
    };
    baseData.productCode = "P";
    return baseData;
  }

  fetchExportShipmentPayload(data) {
    const baseData = this.#fetchShipmentBasePayload(data);
    baseData.productCode = "P";
    const date = new Date();
    baseData.content = {
      ...baseData.content,
      isCustomsDeclarable: true,
      declaredValueCurrency: "NGN",
      declaredValue: data.declaredValue,
      exportDeclaration: {
        ...data.content.exportDeclaration,
        shipmentType: "personal",
        customsDocuments: [
          {
            typeCode: "INV",
            value: "MyDHLAPI - CUSDOC-001",
          },
        ],
        invoice: {
          number: `QC-${date.getUTCSeconds()}`,
          date: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
        },
      },
    };
    return baseData;
  }
}

module.exports = Object.freeze(new DhlService());
