const ServerResponse = require('../utils/response');

const err_names = ['CastError', 'SyntaxError'];

module.exports = (err, req, res, next) => {
	console.log('AN ERROR OCCURED!');
	console.log(`ERROR MESSAGE: ${err.message}\n ERROR_NAME: ${err.name}`);
	console.log(err);
	if (err.name === 'Error') {
		ServerResponse.message(`oops! an error occured.`)
			.success(false)
			.statusCode(500)
			.respond(res);
		return;
	}
	if (err.name === 'CustomError') {
		ServerResponse.message(err.message)
			.success(false)
			.statusCode(err.error_code)
			.respond(res);
	} else if (err_names.includes(err.name)) {
		ServerResponse.message(err.message)
			.success(false)
			.statusCode(400)
			.respond(res);
	} else {
		ServerResponse.message(err.message)
			.success(false)
			.statusCode(500)
			.respond(res);
	}
};
