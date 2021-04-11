import { Controller } from "./controllers/controller.interface";
import * as express from "express";
import * as mongoose from "mongoose";
import { ConnectOptions } from "mongoose";
import errorMiddleware from "./middlewares/error.middleware";
import * as cookieParser from "cookie-parser";

export class App {

    public app: express.Application;
    public port: number;

    constructor(controllers: Controller[], port: number) {
        this.app = express();
        this.port = port;

        this.connectToDatabase();
        this.initializeMiddlewares();
        this.initializeControllers(controllers);
    }
    
    public listen(): void {
        this.app.listen(this.port, () => {
            console.log(`App listening on port ${this.port}`);
        })
    }
    
    private initializeControllers(controllers: any[]) {
        controllers.forEach((controller) => {
            this.app.use('/', controller.router);
        })
    }
    
    private initializeMiddlewares() {
        this.app.use(express.json());
        this.app.use(cookieParser());

        // initialize error middleware should always be last
        this.app.use(errorMiddleware);
    }
    
    private connectToDatabase() {
        
        const {
            MONGO_USER,
            MONGO_PASSWORD,
            MONGO_PATH
        } = process.env;

        const dbOptions: ConnectOptions = 
            { 
                useNewUrlParser: true,
                useUnifiedTopology: true 
            };

        mongoose.connect(`mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_PATH}`, dbOptions);
    }
    
}

export default App;