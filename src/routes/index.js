import authRoute from './authRoute';
import questionRoute from './questionRoute';
import answerRoute from './answerRoute';
import searchRoute from './searchRoute';

const routes = app => {
  authRoute(app);
  questionRoute(app);
  answerRoute(app);
  searchRoute(app);
};
export default routes;
