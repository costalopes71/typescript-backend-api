import { Router } from "express";
import { Controller } from "../controllers/controller.interface";
import * as express from "express";
import validationMiddleware from "middlewares/validation.middleware";
import { CreateUserDTO } from "../user/user.dto";

class AuthenticationController implements Controller {

    path: string = "/auth";
    router: Router = express.Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}/register`, validationMiddleware(CreateUserDTO), this.registration);
    }
    
    private registration = async (request: Request, response: Response, next: express.NextFunction) => {
        
    };

}
