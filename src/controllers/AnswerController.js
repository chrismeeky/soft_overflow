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
    const { body, decoded: { id } } = req;
    try {

    } catch (e) {
      return HelperMethods.serverError(res, e.message);
    }
  }

  /**
   * Get all questions
   * Route: GET: /api/v1/questions
   * @param {object} req - HTTP Request object
   * @param {object} res - HTTP Response object
   * @return {res} res - HTTP Response object
   * @memberof UserController
   */
  static async viewQuestions(req, res) {
    try {
      
    } catch (e) {
      return HelperMethods.serverError(res, e.message);
    }
  }

  /**
   * Get all questions
   * Route: GET: /api/v1/question
   * @param {object} req - HTTP Request object
   * @param {object} res - HTTP Response object
   * @return {res} res - HTTP Response object
   * @memberof UserController
   */
  static async viewAQuestion(req, res) {
    const question = await Question.findById(req.params.id);
    try {
      if (!question.title) return HelperMethods.clientError(res, 'question not found');
      return HelperMethods.requestSuccessful(res, {
        success: true,
        question,
      });
    } catch (e) {
      return HelperMethods.serverError(res, e.message);
    }
  }
}

export default QuestionController;
