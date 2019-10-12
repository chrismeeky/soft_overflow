import { Question } from '../models';
import { HelperMethods } from '../utils';

/**
 * Class representing the question controller
 * @class QuestionController
 * @description question controller
 */
class QuestionController {
  /**
   * Ask a question
   * Route: POST: /api/v1/question
   * @param {object} req - HTTP Request object
   * @param {object} res - HTTP Response object
   * @return {res} res - HTTP Response object
   * @memberof UserController
   */
  static async askQuestion(req, res) {
    const { body, decoded: { id } } = req;
    let allLabels;
    const { labels } = body;
    if (labels) {
      allLabels = labels.split(',').map(label => label.replace(/\s/g, ''));
    }
    const question = new Question({ ...body, userId: id, labels: allLabels });
    try {
      const newQuestion = await question.save();
      if (newQuestion) {
        return HelperMethods.requestSuccessful(res, {
          success: true,
          question: newQuestion
        });
      }
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
    const questions = await Question.find({});
    try {
      if (!questions.length) return HelperMethods.clientError(res, 'no questions found');
      return HelperMethods.requestSuccessful(res, {
        success: true,
        questions,
      });
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
