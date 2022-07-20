import ServerResponse from '../utils/response';

const err_names = ['CastError', 'SyntaxError'];

export default (err, req, res, next) => {
	console.log('AN ERROR OCCURED!');
	console.log(`ERROR MESSAGE: ${err.message}\n ERROR_NAME: ${err.name}`);
	console.log(err);
	if (err.name === 'Error') {
		new ServerResponse(`oops! an error occured.`)
			.success(false)
			.statusCode(500)
			.respond(res);
		return;
	}
	if (err.name === 'CustomError') {
		new ServerResponse(`oops! an error occured : ${err.message}`)
			.success(false)
			.statusCode(err.error_code)
			.respond(res);
	} else if (err_names.includes(err.name)) {
		new ServerResponse(`oops! an error occured : ${err.message}`)
			.success(false)
			.statusCode(400)
			.respond(res);
	} else {
		new ServerResponse(`oops! an error occured : ${err.message}`)
			.success(false)
			.statusCode(500)
			.respond(res);
	}
};
