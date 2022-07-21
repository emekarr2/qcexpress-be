const mongoose = require('mongoose');

class MongoDBClient {
	#connection;
	constructor() {
		this.MONGODB_URL = process.env.MONGODB_URL;
		mongoose.set('debug', true);
		mongoose.set('toJSON', { virtuals: true });
		mongoose.Promise = global.Promise;
		console.log('URL -==> ', this.MONGODB_URL);
	}

	getConnection() {
		return this.#connection;
	}

	async connect() {
		try {
			if (this.#connection) return this.#connection;
			this.#connection = await mongoose.connect(this.MONGODB_URL, {
				useNewUrlParser: true,
				useCreateIndex: true,
				useFindAndModify: false,
				useUnifiedTopology: true,
				retryWrites: false,
			});
			console.log('MongoDBClient() => CONNECTED!');
			return true;
		} catch (error) {
			console.error('An error occurred', JSON.stringify(error));
			console.log(
				error.message,
				new Error(error.message),
				{ dbURL: this.MONGODB_URL },
				true,
			);
			process.exit(0);
		}
	}

	async disconnect() {
		await this.#connection.disconnect();
		console.log('MongoDBClient() => DISCONNECTED!');
	}
}

process.on('SIGINT', () => {
	mongoose.connection.close(() => {
		console.log('Mongoose disconnected on app termination');
		process.exit(0);
	});
});

module.exports = Object.freeze(new MongoDBClient());
