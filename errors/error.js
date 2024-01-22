module.exports = class CustomError extends Error {
	#name = 'CustomError';
	constructor(message, error_code) {
		console.log('CustomError Message')
		console.log(message)
		super(message);
		this.message = message;
		this.name = this.#name;
		this.error_code = error_code;
	}
};
