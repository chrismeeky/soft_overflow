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
    const { email, password, username } = req.body;
    try {
      const userNameExist = await User.findOne({ username });
      if (userNameExist) {
        return HelperMethods.clientError(res, 'username already exists');
      }
      const userExist = await User.findOne({ email, });
      if (userExist) {
        if (!userExist.isVerified) {
          const isEmailSent = await
          UserController.createTokenAndSendEmail(userExist);
          if (isEmailSent) {
            return HelperMethods
              .requestSuccessful(res, {
                message: 'You had started the registration process earlier. '
                  + 'An email has been sent to your email address. '
                  + 'Please check your email to complete your registration.'
              }, 200);
          }
          return HelperMethods
            .serverError(res, 'Your registration could not be completed.'
              + ' Please try again');
        }
        return HelperMethods
          .requestSuccessful(res, {
            message: 'You are a registered user on this platform. Please proceed to login'
          }, 200);
      }
      req.body.password = await CryptData.encryptData(password);
      const user = new User(req.body);
      const userCreated = await user.save();
      const isEmailSent = await
      UserController.createTokenAndSendEmail(userCreated);
      if (isEmailSent) {
        return HelperMethods
          .requestSuccessful(res, {
            success: true,
            message: 'An email has been sent to your '
                + 'email address. Please check your email to complete your registration'
          }, 200);
      }
      HelperMethods
        .serverError(res, 'Your registration could not be completed. Please try again');
    } catch (error) {
      return HelperMethods.serverError(res);
    }
  }

  /**
   * Verify a user's email
   * Route: POST: /auth/verify_email
   * @param {object} req - HTTP Request object
   * @param {object} res - HTTP Response object
   * @return {res} res - HTTP Response object
   * @memberof UserController
   */
  static async verifyEmail(req, res) {
    try {
      const foundUser = await User.findOne({ _id: req.decoded.id });
      if (foundUser) {
        const userUpdated = await User.updateOne({ _id: req.decoded.id },
          { $set: { isVerified: true } });
        if (userUpdated) {
          const isEmailSent = await
          SendEmail.confirmRegistrationComplete(foundUser.email);
          if (isEmailSent) {
            const tokenCreated = await Authentication.getToken(userUpdated);
            return res.status(201).json({
              success: true,
              message: `User ${foundUser.username} created successfully`,
              id: userUpdated.id,
              username: userUpdated.username,
              token: tokenCreated,
            });
          }
        }
      }
      return HelperMethods
        .serverError(res, 'Could not complete your registration. '
          + 'Please re-register.');
    } catch (error) {
      return HelperMethods.serverError(res);
    }
  }

  /**
   * Login a user
   * Route: POST: /auth/login
   * @param {object} req - HTTP Request object
   * @param {object} res - HTTP Response object
   * @return {res} res - HTTP Response object
   * @memberof UserController
   */
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const userFound = await User.findOne({ email });
      if (!userFound) {
        return HelperMethods.clientError(res, 'Email or password does not exist', 400);
      }
      if (!userFound.isVerified) {
        return HelperMethods.clientError(res, {
          success: false,
          message: 'You had started the registration process already. '
            + 'Please check your email to complete your registration.'
        }, 400);
      }
      const isPasswordValid = await CryptData.decryptData(password, userFound.password);
      if (userFound && isPasswordValid) {
        const tokenCreated = await Authentication.getToken({
          id: userFound.id,
          username: userFound.username,
          role: userFound.role,
        });
        if (tokenCreated) {
          const userDetails = {
            id: userFound.id,
            username: userFound.username,
            role: userFound.role,
            token: tokenCreated,
          };
          return HelperMethods.requestSuccessful(res, {
            success: true,
            message: 'Login successful',
            userDetails,
          }, 200);
        }
      }
      return HelperMethods.clientError(res, 'Email or password does not exist', 400);
    } catch (error) {
      return HelperMethods.serverError(res);
    }
  }
}

export default UserController;
