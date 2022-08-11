const base64ToArrayBuffer = require('base64-arraybuffer');

class FileManager {
	#base64ToArrayBuffer = {};

	constructor() {
		this.#base64ToArrayBuffer = base64ToArrayBuffer;
	}

	base64ToArrayBuffer(data) {
		return this.#base64ToArrayBuffer.decode(data);
	}
}

module.exports = Object.freeze(new FileManager());
