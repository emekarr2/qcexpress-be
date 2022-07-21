class ServerResponse {
	payload = { message: '', data: null, success: true };

	constructor(message, data = null, success = true) {
		this.message = message;
		this.data = data;
		this.success = success;
	}

	respond(res, status_code) {
		this.payload = {
			message: this.message,
			data: this.data || null,
			success: this.success || false,
		};
		res.status(status_code).json(this.payload);
	}
}

class ServerResponseBuilder {
	#response;
	#status_code = 200;

	message(message) {
		this.#response = new ServerResponse(message);
		return this;
	}

	data(data) {
		this.#response.data = data;
		return this;
	}

	success(success) {
		this.#response.success = success;
		return this;
	}

	statusCode(status_code) {
		this.#status_code = status_code;
		return this;
	}

	respond(res) {
		this.#response.respond(res, this.#status_code);
	}
}

module.exports = Object.freeze(new ServerResponseBuilder());
