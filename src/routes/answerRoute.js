import { AnswerController } from '../controllers';
import Validate from '../validation';
import { Authorization } from '../middlewares';

const answerRoute = app => {
  app.post('/api/v1/answer/:question',
    Authorization.checkToken,
    Validate.validateUserInput,
    AnswerController.answerQuestion);
};
export default answerRoute;
