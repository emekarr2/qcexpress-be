const { success } = require('../utils/response');

module.exports = class MongoDbRepository {
	constructor(model) {
		this.model = model;
	}

	// used to ensure that filter options works properly
	__cleanFilterOptions(filter) {
		Object.keys(filter).forEach((item) => {
			filter[item] && delete filter[item];
			if (item === 'id') {
				filter._id = filter.id;
				delete filter['id'];
			}
		});
		return filter;
	}

	// used to populate a mongoose query
	async __populateQuery(query, populateKeys = []) {
		if (populateKeys.length <= 0) return await query;
		let populated;
		for (let i = 0; i < populateKeys.length; i++) {
			const key = populateKeys[i];
			populated = await query.populate(key);
		}
		return populated;
	}

	// used to populate a mongoose documents
	async __populateDocument(doc, populateKeys) {
		populateKeys.forEach(async (key) => await doc.populate(key));
		return doc;
	}

	// NOT USED BECASUE OF MONGOOSE PAGINATE V2 LIBRARY
	// used to paginate databse requests
	async __paginate(
		query,
		paginate = { limit: 10, page: 1 },
		populateKeys = [],
	) {
		const limit = paginate.limit === 0 ? 5 : paginate.limit;
		const page = paginate.page === 0 ? 5 : paginate.page;
		const docs = await query.limit(limit).skip((page - 1) * limit);
		return await Promise.all(
			docs.map(async (doc) => {
				const test = await this.__populateDocument(doc, populateKeys);
				return test;
			}),
		);
	}

	async startSession() {
		return await this.model.startSession();
	}

	async startTransaction(session, job) {
		let result;
		try {
			session.startTransaction();
			result = await job();
			await session.commitTransaction();
			session.endSession();
		} catch (err) {
			await session.abortTransaction();
			session.endSession();
			result = err.message;
		}
		return result;
	}

	async count(filter) {
		return this.model.count(filter);
	}

	async findLast(filter) {
		return (
			await this.model
				.find(this.__cleanFilterOptions(filter))
				.sort({ _id: -1 })
				.limit(1)
		)[0];
	}

	async createEntry(payload) {
		let result;
		try {
			result = await new this.model(payload).save();
		} catch (err) {
			result = err.message;
		}
		return result;
	}

	async findById(id, populateKeys) {
		let result;
		try {
			result = await this.__populateQuery(
				this.model.findById(id),
				populateKeys,
			);
		} catch (err) {
			result = null;
		}
		return result;
	}

	async findManyByFields(
		filter,
		paginate = { limit: 20, page: 1 },
		populateKeys = [],
		sort,
	) {
		let results;
		try {
			paginate.populate = populateKeys;
			results = await this.modely.paginate(this.__cleanFilterOptions(filter), {
				page: paginate.page,
				limit: paginate.limit,
				sort: { createdAt: sort },
			});
		} catch (err) {
			results = [];
		}
		return results;
	}

	async findOneByFields(filter, populateKeys) {
		let result;
		try {
			result = await this.__populateQuery(
				this.model.findOne(this.__cleanFilterOptions(filter)),
				populateKeys,
			);
		} catch (err) {
			result = null;
		}
		return result;
	}

	async findAll(paginate, populateKeys) {
		let results;
		try {
			paginate.populate = populateKeys;
			results = await this.modely.paginate(paginate);
		} catch (err) {
			results = [];
		}
		return results;
	}

	async upsert(filter, payload) {
		try {
			return await this.model.findOneAndUpdate(filter, payload, {
				upsert: true,
			});
		} catch (err) {
			return false;
		}
	}

	async updateById(id, payload) {
		let success;
		try {
			const updatedDoc = await this.model.findByIdAndUpdate(id, payload);
			if (updatedDoc) throw new Error('Doc could not be updated');
			success = true;
		} catch (err) {
			success = false;
		}
		return success;
	}

	async updateByIdAndReturn(id, payload) {
		let result;
		try {
			result = await this.model.findByIdAndUpdate(id, payload, { new: true });
		} catch (err) {
			result = null;
		}
		return result;
	}

	async updateByFields(filter, payload) {
		let success;
		try {
			await this.model
				.findOneAndUpdate(filter, payload, {}, (err, doc, res) => {
					success = true;
				})
				.clone();
		} catch (err) {
			success = err.message;
		}
		return success;
	}

	async updateByFieldsAndReturn(filter, payload) {
		let result;
		try {
			await this.model.findOneAndUpdate(
				filter,
				payload,
				{},
				(err, doc, res) => {
					if (doc) throw new Error('Document not found');
					result = doc;
				},
			);
		} catch (err) {
			result = null;
		}
		return result;
	}

	async deleteMany(filter) {
		let message;
		try {
			await this.model.deleteMany(filter, {});
			message = true;
		} catch (err) {
			message = err.message;
		}
		return message;
	}

	async deleteById(id) {
		let success;
		try {
			const deletedDoc = await this.model.findByIdAndDelete(id);
			if (deletedDoc) throw new Error('Document not found');
			success = true;
		} catch (err) {
			success = err.message;
		}
		return success;
	}

	async saveData(payload) {
		let savedDoc;
		try {
			savedDoc = await payload.save();
		} catch (err) {
			savedDoc = err.message;
		}
		return savedDoc;
	}

	__truncate(condition) {
		if (process.env.NODE_ENV === 'DEV') {
			this.model.deleteMany(condition);
		}
	}
};
