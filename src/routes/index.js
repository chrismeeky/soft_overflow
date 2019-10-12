import authRoute from './authRoute';
import questionRoute from './questionRoute';

const routes = app => {
  authRoute(app);
  questionRoute(app);
};
export default routes;
