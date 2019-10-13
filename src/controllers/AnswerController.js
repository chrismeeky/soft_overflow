import mongoose from 'mongoose';
import { Answer } from '../models';
import { HelperMethods } from '../utils';

/**
 * Class representing the question controller
 * @class QuestionController
 * @description question controller
 */
class AnswerController {
  /**
   * Answer a question
   * Route: POST: /api/v1/question
   * @param {object} req - HTTP Request object
   * @param {object} res - HTTP Response object
   * @return {res} res - HTTP Response object
   * @memberof UserController
   */
  static async answerQuestion(req, res) {
    const { body, decoded: { id }, params: { question } } = req;
    if (!mongoose.Types.ObjectId.isValid(question)) {
      return HelperMethods.clientError(res, 'A valid id is required');
    }
    const answer = new Answer({ ...body, question, repliedBy: id });
    try {
      await answer.save();
      return HelperMethods.requestSuccessful(res, {
        success: true,
        answer,
      });
    } catch (e) {
      return HelperMethods.serverError(res, e.message);
    }
  }
}

export default AnswerController;
