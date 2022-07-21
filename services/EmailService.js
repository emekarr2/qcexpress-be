var mailgun = require('mailgun-js');

class EmailService {
	#mg;

	constructor() {
		this.#mg = mailgun({
			apiKey: process.env.MAILGUN_API_KEY,
			domain: process.env.MAILGUN_DOMAIN,
		});
	}

	async send({ from, to, subject, template, payload }) {
		console.log(from, to, payload);
		await this.#mg.messages().send({ from, to, subject, template, ...payload });
	}
}

module.exports = Object.freeze(new EmailService());
