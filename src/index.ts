import App from './app';
import SearchController from './controller/search.controller';
import { saveData } from './test';

const app = new App([new SearchController()], 3000);

app.listen();
saveData().then(() => console.log("done"));
