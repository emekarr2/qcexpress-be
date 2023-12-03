const feedbackRepository = require("../repository/feedback.repository");
const ServerResponse = require("../../../utils/response");
const { validateFeedback } = require("../feedback.validator");
const CustomError = require("../../../errors/error");

class FeedBackController {
  async sendFeedback(req, res, next) {
    try {
      const payload = {
        content: req.body.content,
        email: req.admin.email,
        business: req.admin.business,
        from: req.admin.id,
        admin_name: req.admin.name,
        org_name: req.admin.org_name,
      };
      const validationResult = validateFeedback(payload);
      if (validationResult.error)
        throw new CustomError(validationResult.error.message, 400);
      await feedbackRepository.createEntry(payload);
      ServerResponse.message("feedback sent")
        .statusCode(201)
        .success(true)
        .respond(res);
    } catch (err) {
      next(err);
    }
  }

  async deleteFeedback(req, res, next) {
    try {
      const feedback = await feedbackRepository.findOneByFields({
        id: req.query.id,
        business: req.admin.business,
        from: req.admin.id,
      });
      if (!feedback) throw new CustomError("this feedback does not exist", 404);
      if (feedback.resolved)
        throw new CustomError(
          "this feedback has already been read and cannot be deleted",
          400
        );
      await feedbackRepository.deleteById(feedback.id);
      ServerResponse.message("feedback deleted")
        .statusCode(200)
        .data(feedback)
        .success(true)
        .respond(res);
    } catch (err) {
      next(err);
    }
  }

  async fetchFeedback(req, res, next) {
    try {
      const feedbacks = await feedbackRepository.findManyByFields(
        {
          business: req.admin.business,
          from: req.admin.id,
        },
        {
          page: req.query.page,
          limit: req.query.limit,
        }
      );

      ServerResponse.message("feedback fetched")
        .statusCode(200)
        .data(feedbacks)
        .success(true)
        .respond(res);
    } catch (err) {
      next(err);
    }
  }

  async fetchFeedbackAdmin(req, res, next) {
    try {
      const feedbacks = await feedbackRepository.findManyByFields(req.body, {
        page: req.query.page,
        limit: req.query.limit,
      });

      ServerResponse.message("feedback fetched")
        .statusCode(200)
        .data(feedbacks)
        .success(true)
        .respond(res);
    } catch (err) {
      next(err);
    }
  }

  async resolveFeedbackAdmin(req, res, next) {
    try {
      if (!req.query.id) throw new CustomError("id is required", 400);
      const feedbacks = await feedbackRepository.updateById(req.query.id, {
        resolved: true,
      });

      ServerResponse.message("feedback resolved")
        .statusCode(200)
        .data(feedbacks)
        .success(true)
        .respond(res);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = Object.freeze(new FeedBackController());
