import { User, Question, Answer } from '../models';
import { HelperMethods } from '../utils';

/**
 * Class representing the question controller
 * @class QuestionController
 * @description question controller
 */
class SearchController {
  /**
   * Ask a question
   * Route: POST: /api/v1/question
   * @param {object} req - HTTP Request object
   * @param {object} res - HTTP Response object
   * @return {res} res - HTTP Response object
   * @memberof SearchController
   */
  static async search(req, res) {
    const exclude = {
      password: 0,
      isSubscribed: 0,
      hasProfile: 0,
      isVerified: 0,
      email: 0,
      status: 0,
      // eslint-disable-next-line quote-props
      '_id': 0,
    };
    const { searchTerm } = req.body;
    try {
      const questions = await Question.find({ $text: { $search: searchTerm } });
      const users = await User.find({ $text: { $search: searchTerm } }, exclude);
      const answers = await Answer.find({ $text: { $search: searchTerm } });
      return HelperMethods.requestSuccessful(res, {
        success: true,
        questions,
        users,
        answers,
      });
    } catch (error) {
      return HelperMethods.serverError(res, error);
    }
  }
}

export default SearchController;
