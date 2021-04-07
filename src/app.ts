import { Controller } from "./controllers/controller.interface";
import * as express from "express";
import * as mongoose from "mongoose";

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
    }
    
    private connectToDatabase() {
        const {
            MONGO_USER,
            MONGO_PASSWORD,
            MONGO_PATH
        } = process.env;

        mongoose.connect(`mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_PATH}`);
    }
    
}

export default App;