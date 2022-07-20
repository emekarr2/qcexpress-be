const bcrypt = require('bcrypt');

class Hasher {
	#hasher = bcrypt;

	#salt_rounds = 10;

	async hashPassword(password) {
		return await this.#hasher.hash(password, this.__genSalt);
	}

	async verifyPassword(password, hash) {
		return await this.#hasher.compare(password, hash);
	}

	async __genSalt() {
		return await this.#hasher.__genSalt(this.#salt_rounds);
	}
}

module.exports = Object.freeze(new Hasher());
