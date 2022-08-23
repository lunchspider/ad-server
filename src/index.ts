import App from './app';
import SearchController from './controller/search.controller';
const app = new App([new SearchController()], 3000);

app.listen();
