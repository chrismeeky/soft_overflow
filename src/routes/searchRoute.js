import { SearchController } from '../controllers';

const searchRoute = app => {
  app.get('/api/v1/search',
    SearchController.search);
};
export default searchRoute;
