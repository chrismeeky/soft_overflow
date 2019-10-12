import { User } from '../models';
import {
  Authentication, SendEmail, HelperMethods, CryptData
} from '../utils';

/**
 * Class representing the user controller
 * @class UserController
 * @description users controller
 */
class UserController {
  /**
   * This method creates a temporary token and then
   * sends an email to the user.
   * @param {object} userExist - An object containing details of the
   * user we want to send an email to.
   * @returns {boolean} isEmailSent - Tells if email was actually sent
   */
  static async createTokenAndSendEmail(userExist) {
    const tokenCreated = await Authentication.getToken(userExist, '1h');
    if (tokenCreated) {
      const isEmailSent = await
      SendEmail.verifyEmail(userExist.email, userExist.firstName, tokenCreated);
      return isEmailSent;
    }
  }

  /**
   * Sign up a user
   * Route: POST: /auth/signup
   * @param {object} req - HTTP Request object
   * @param {object} res - HTTP Response object
   * @return {res} res - HTTP Response object
   * @memberof UserController
   */
  static async signUp(req, res) {
    const { email, password } = req.body;
    try {
      const userExist = await User.findOne({ email, });
      if (userExist) {
        if (!userExist.isVerified) {
          const isEmailSent = await
          UserController.createTokenAndSendEmail(userExist);
          if (isEmailSent) {
            return HelperMethods
              .requestSuccessful(res, {
                message: 'You had started the registration '
                  + 'process earlier. '
                  + 'An email has been sent to your email address. '
                  + 'Please check your email to complete your registration.'
              }, 200);
          }
          return HelperMethods
            .serverError(res, 'Your registration could not be completed.'
              + ' Please try again');
        }
        if (userExist.isVerified === true) {
          return HelperMethods
            .requestSuccessful(res, {
              message: 'You are a registered user on '
                + 'this platform. Please proceed to login'
            }, 200);
        }
      }
      const userNameExist = await User.findOne({ username: req.body.username });

      if (userNameExist) {
        return HelperMethods.clientError(res, 'username already exists');
      }

      req.body.password = await CryptData.encryptData(password);
      const user = new User(req.body);
      const userCreated = await user.save();
      if (userCreated) {
        const isEmailSent = await
        UserController.createTokenAndSendEmail(userCreated);
        if (isEmailSent) {
          return HelperMethods
            .requestSuccessful(res, {
              success: true,
              message: 'An email has been sent to your '
                + 'email address. Please check your email to complete '
                + 'your registration'
            }, 200);
        }
        return HelperMethods
          .serverError(res, 'Your registration could not be completed.'
            + 'Please try again');
      }
    } catch (error) {
      return HelperMethods.serverError(res);
    }
  }
}

export default UserController;