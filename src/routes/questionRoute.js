import { QuestionController } from '../controllers';
import Validate from '../validation';
import { Authorization } from '../middlewares';

const questionRoute = app => {
  app.post('/api/v1/question',
    Authorization.checkToken,
    Validate.validateUserInput,
    QuestionController.askQuestion);
  app.get('/api/v1/questions',
    QuestionController.viewQuestions);
};

export default questionRoute;
