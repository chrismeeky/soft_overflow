import mongoose from 'mongoose';
import {
  Answer, Question, Message, User
} from '../models';
import { HelperMethods, SendEmail } from '../utils';

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
    const postedQuestion = await Question.findById(question);
    try {
      const savedAnswer = await answer.save();
      if (savedAnswer) {
        if (postedQuestion.isSubscribed) {
          const responder = await User.findById(id);
          const recipient = await User.findById(postedQuestion.userId);
          const isNotified = await SendEmail.sendEmailNotification(responder, recipient);
          if (isNotified) {
            const { username } = responder;
            const message = new Message({
              postedBy: postedQuestion.userId,
              repliedBy: id,
              message: `User, ${username} left you a comment to your question`
            });
            message.save();
          }
        }
        return HelperMethods.requestSuccessful(res, {
          success: true,
          answer,
        });
      }
    } catch (e) {
      return HelperMethods.serverError(res, e.message);
    }
  }
}

export default AnswerController;
