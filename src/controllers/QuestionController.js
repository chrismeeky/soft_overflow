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
   * Get specific question
   * Route: GET: /api/v1/question
   * @param {object} req - HTTP Request object
   * @param {object} res - HTTP Response object
   * @return {res} res - HTTP Response object
   * @memberof UserController
   */
  static async viewAQuestion(req, res) {
    const question = await Question.findById(req.params.id);
    try {
      if (!question.title) {
        return HelperMethods.clientError(res, 'question not found');
      }
      return HelperMethods.requestSuccessful(res, {
        success: true,
        question,
      });
    } catch (e) {
      return HelperMethods.serverError(res, e.message);
    }
  }

  /**
   * Upvote or Downvote a question
   * Route: GET: /api/v1/question/:id/vote
   * @param {object} req - HTTP Request object
   * @param {object} res - HTTP Response object
   * @return {res} res - HTTP Response object
   * @memberof QuestionController
   */
  static async voteAQuestion(req, res) {
    const { id, type } = req.params;
    const question = await Question.findById(id);
    try {
      if (!question || !question.title) {
        return HelperMethods.clientError(res, 'question not found');
      }
      let { votes } = question;
      if (req.decoded.id.toString() === question.userId.toString()) {
        return HelperMethods.clientError(res,
          'You cannot vote on your own question');
      }
      if (votes.filter(vote => vote.id === id && vote.type === type).length > 0) {
        votes = [...votes];
      } else {
        switch (type) {
          case 'up':
            votes.push({ type, id });
            break;
          case 'down':
            votes.splice(votes.indexOf(req.decoded.id), 1);
            break;
          default:
            votes = [...votes];
        }
      }

      await Question.updateOne({ _id: req.params.id }, { $set: { votes, } });
      return HelperMethods.requestSuccessful(res, {
        success: true,
        message: 'Thank you for your feedback. Your vote has been recorded',
        question,
        totalVotes: votes.length
      });
    } catch (e) {
      return HelperMethods.serverError(res, e.message);
    }
  }
}

export default QuestionController;
