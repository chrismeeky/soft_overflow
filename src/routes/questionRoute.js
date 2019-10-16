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
  app.get('/api/v1/question/:id',
    Validate.validateID,
    QuestionController.viewAQuestion);
  app.patch('/api/v1/vote/:id/:type',
    Authorization.checkToken,
    Validate.validateID,
    QuestionController.voteAQuestion);
};

export default questionRoute;
