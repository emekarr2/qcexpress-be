const axios = require("axios");
const CustomError = require("../errors/error");

module.exports = class HttpService {
  #axios = axios;

  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.timeout = 20000;
    this.__error = {
      message: "Could not successfully complete request to an external server",
      useAsDefault: true,
    };
  }

  get requestInstance() {
    axios.default.get;
    const instance = this.#axios.create({
      baseURL: this.baseUrl,
      timeout: this.timeout,
      headers: this.headers,
    });
    instance.interceptors.request.use((config) => {
      const { url, method, baseURL, data } = config;
      console.log(
        `HTTPService: ${method.toUpperCase()} ==> ${baseURL}${url} >>> [DATA]: `,
        data
      );
      return config;
    });
    return instance;
  }

  setHeaders(headers) {
    this.headers = headers;
    return this;
  }

  setHeader(headers) {
    this.headers = { ...this.headers, ...headers };
    return this;
  }

  setAuthHeader(authData) {
    this.setHeader({ Authorization: authData });
    return this;
  }

  setBasicAuth({ username, password }) {
    const TOKEN = Buffer.from(username + ":" + password).toString("base64");
    this.setAuthHeader("Basic " + TOKEN);
    return this;
  }

  onError(errorMsgOrFunction) {
    if (typeof errorMsgOrFunction == "function")
      this.__error.handler = errorMsgOrFunction;
    else this.__error.message = errorMsgOrFunction;
    return this;
  }

  async get(url, options) {
    return await this._handleRequest(this.requestInstance.get(url, options));
  }

  async post(url, data, options) {
    return await this._handleRequest(
      this.requestInstance.post(url, data, options)
    );
  }

  async update(url, data, options) {
    return await this._handleRequest(
      this.requestInstance.put(url, data, options)
    );
  }

  async delete(url, options) {
    return await this._handleRequest(this.requestInstance.delete(url, options));
  }

  async _handleRequest(requestPromise) {
    try {
      const response = await Promise.resolve(requestPromise);
      console.log('response',response)
      return response.data;
    } catch (e) {
      let message = this.__error.message;
      console.log('HTTPSERVICE ERROR', message)
      if (e.request?.res?.statusCode === 404) {
        return null;
      }
      if (e.response) {
        if (e.isAxiosError && this.__error.useAsDefault) {
          message = e.response?.data ?? e.response ?? message;
        }
      } else if (typeof this.__error.handler === "function") {
        message = this.__error.handler.call(this, message);
      }
      // console.log(message);
      throw new CustomError(message, 500);
    }
  }
};
