import { HttpException } from "../exceptions/HttpException";
import { PostNotFoundException } from "../exceptions/PostNotFoundException"
import { NextFunction, Request, Response, Router } from "express";
import { Post } from "../post/post.interface";
import postModel from "../post/posts.model";
import { Controller } from "./controller.interface";
import validationMiddleware from "../middlewares/validation.middleware";
import { CreatePostDTO } from "../post/post.dto";
import authMiddleware from "../middlewares/auth.middleware";
import { RequestWithUser } from "../interfaces/requestwithuser.interface";

class PostContoller implements Controller {

    path: string = '/post';
    router: Router = Router();
    private postModel = postModel;

    constructor() {
        this.initializeRoutes();
    }
    
    private initializeRoutes() {
        this.router.get(this.path, this.getAllPosts);
        this.router.get(`${this.path}/:id`, this.getPostById);

        this.router.all(`${this.path}/*`, authMiddleware)
            .patch(`${this.path}/:id`, validationMiddleware(CreatePostDTO, true), this.modifyPost)
            .delete(`${this.path}/:id`, this.deletePost)
            .post(this.path, authMiddleware, validationMiddleware(CreatePostDTO), this.createPost);
    }
    
    private getPostById = (request: Request, response: Response, next: NextFunction): void => {
        const postId = request.params.id;
        
        this.postModel.findById(postId)
            .then((post) => {

                if (post) {
                    response.send(post);
                } else {
                    next(new HttpException(404, 'Not found'));
                }

            });
    };

    private getAllPosts = (request: Request, response: Response): void => {
        this.postModel.find()
            .then((posts) => response.send(posts));
    };

    private createPost = async (request: RequestWithUser, response: Response) => {
        const postData: Post = request.body;
        const createdPost = new this.postModel({
            author: postData.author,
            content: postData.content,
            title: postData.title,
            authorId: request.user!._id
        });

        createdPost.save()
            .then((savedPost) => response.send(savedPost));
    }

    private modifyPost = (request: Request, response: Response, next: NextFunction): void => {
        const postId = request.params.id;
        const postData: Post = request.body;

        this.postModel.findByIdAndUpdate(postId, postData, { new: true })
            .then((post) => {   
                if (post) {
                    response.send(post)
                } else {
                    next(new PostNotFoundException(postId));
                }
            });

    }

    private deletePost = (request: Request, response: Response, next: NextFunction): void => {
        const postId = request.params.id;

        this.postModel.findByIdAndDelete(postId)
            .then((successResponse) => {
                if (successResponse) {
                    response.send(200);
                } else {
                    next(new PostNotFoundException(postId));
                }
            });
    }

}

export default PostContoller;