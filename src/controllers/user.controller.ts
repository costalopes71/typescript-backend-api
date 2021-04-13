import { NotAuthorizedException } from "../exceptions/NotAuthorizedException";
import { NextFunction, Request, Response, Router } from "express";
import { RequestWithUser } from "../interfaces/requestwithuser.interface";
import postModel from "../post/posts.model";
import authMiddleware from "../middlewares/auth.middleware";
import { Controller } from "./controller.interface";

export class UserController implements Controller {

    router: Router = Router();
    path: string = '/users';
    private postModel = postModel;
        
    constructor() {
        this.initializeRoutes();
    }
    
    private initializeRoutes() {
        this.router.get(`${this.path}/:id/posts`, authMiddleware, this.getAllPostsOfUser);
    }

    private getAllPostsOfUser = async (request: RequestWithUser, response: Response, next: NextFunction) => {

        const userId = request.params.id;

        if (userId === request.user!._id.toString()) {
            const posts = await this.postModel.find({ author : userId });
            response.send(posts);
        } else {
            next(new NotAuthorizedException());
        }

    };

}