import express  from 'express';
import {Controller} from './types/controller';
class App{
    public app : express.Application;
    public port : number;
    constructor(controllers : Controller[], port : number){
        this.app = express();
        this.port = port;
        controllers.forEach((val) => {
            this.app.use('/', val.router);
        })
    }
    public listen(){
        this.app.listen(this.port, () => {
            console.log(`App listening on the port ${this.port}`);
        })
    }
}

export default App;
