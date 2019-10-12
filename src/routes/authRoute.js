import { UserController } from '../controllers';
import Validate from '../validation';

const authRoutes = app => {
  app.post(
    '/api/v1/auth/signup',
    Validate.validateUserInput,
    UserController.signUp,
  );
};

export default authRoutes;

