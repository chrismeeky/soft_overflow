import { QuestionController } from '../controllers';
import Validate from '../validation';
import { Authorization } from '../middlewares';

const questionRoute = app => {
  app.post('/api/v1/question',
    Authorization.checkToken,
    Validate.validateUserInput,
    QuestionController.askQuestion);
};

export default questionRoute;
