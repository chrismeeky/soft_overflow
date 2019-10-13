import authRoute from './authRoute';
import questionRoute from './questionRoute';
import answerRoute from './answerRoute';

const routes = app => {
  authRoute(app);
  questionRoute(app);
  answerRoute(app);
};
export default routes;
