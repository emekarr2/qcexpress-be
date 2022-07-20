const Repository = require('../../../repository/mongo');
const BookingModel = require('../model/Booking');

class BookingRepository extends Repository {
	constructor() {
		super(BookingModel);
	}
}

module.exports = Object.freeze(new BookingRepository());
