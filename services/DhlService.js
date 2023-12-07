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

  async trackShipment(trackingId) {
    return await this.#httpService.get(`/shipments/${trackingId}/tracking`);
  }

  #fetchShipmentBasePayload(data) {
    return {
      plannedShippingDateAndTime: data.plannedShippingDateAndTime,
      productCode: "N",
      pickup: {
        isRequested: false,
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
        description: data.content.description,
        packages: data.content.packages,
      },
    };
  }

  fetchDomesticShipmentPayload(data) {
    return this.#fetchShipmentBasePayload(data);
  }

  fetchExportShipmentPayload(data, productCode) {
    const baseData = this.#fetchShipmentBasePayload(data);
    const date = new Date();
    const parsedInvDate = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
    baseData.content = {
      ...baseData.content,
      ...data.content,
      declaredValueCurrency: "NGN",
      isCustomsDeclarable: productCode === "D" ? false : true,
      exportDeclaration: {
        ...data.content.exportDeclaration,
        exportReason: "Permanent",
        exportReasonType: "permanent",
        invoice: {
          number: `QCINV-${date.getUTCSeconds()}`,
          date: parsedInvDate,
        },
      },
    };
    baseData.productCode = productCode;
    return baseData;
  }

  fetchImportShipmentPayload(data, productCode) {
    const baseData = this.#fetchShipmentBasePayload(data);
    const date = new Date();
    const parsedInvDate = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
    baseData.content = {
      ...baseData.content,
      ...data.content,
      declaredValueCurrency: "NGN",
      isCustomsDeclarable: productCode === "D" ? false : true,
      exportDeclaration: {
        ...data.content.exportDeclaration,
        exportReason: "Permanent",
        exportReasonType: "permanent",
        invoice: {
          number: `QCINV-${date.getUTCSeconds()}`,
          date: parsedInvDate,
        },
      },
    };
    baseData.productCode = productCode;
    return baseData;
  }
}

module.exports = Object.freeze(new DhlService());
