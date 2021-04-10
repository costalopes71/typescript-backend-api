import { Router } from "express";
import { Controller } from "../controllers/controller.interface";
import { Request, Response, NextFunction} from "express";
import * as express from "express";
import validationMiddleware from "../middlewares/validation.middleware";
import { CreateUserDTO } from "../user/user.dto";
import userModel from "../user/user.model";
import { UserWithThatEmailAlreadyExistsException } from "../exceptions/UserWithThatEmailAlreadyExistsException";
import { WrongCredentialsException } from "../exceptions/WrongCredentialsException";
import * as bcrypt from "bcrypt";
import { LogInDTO } from "./logIn.dto";

class AuthenticationController implements Controller {

    path: string = "/auth";
    router: Router = express.Router();
    private userModel = userModel;

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}/register`, validationMiddleware(CreateUserDTO), this.registration);
        this.router.post(`${this.path}/login`, validationMiddleware(LogInDTO), this.loggingIn);
    }
    
    private registration = async (request: Request, response: Response, next: NextFunction) => {
        
        const userData: CreateUserDTO = request.body;

        if (await this.userModel.findOne({ email: userData.email })) {
            next(new UserWithThatEmailAlreadyExistsException(userData.email));
        } else {
            
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            const newUser = await this.userModel.create({
                name: userData.firstName,
                email: userData.email,
                password: hashedPassword
            });

            newUser.password = "";
            response.send(newUser);
        }

    };

    private loggingIn = async (request: Request, response: Response, next: NextFunction) => {

        const logInData: LogInDTO = request.body;
        const user = await userModel.findOne({ email: logInData.email });

        if (user) {
            const isPasswordMatching = await bcrypt.compare(logInData.password, user.password);

            if (isPasswordMatching) {
                user.password = "";
                response.send(user);
            } else {
                next(new WrongCredentialsException());
            }

        } else {
            next(new WrongCredentialsException());
        }

    };

}

export default AuthenticationController;