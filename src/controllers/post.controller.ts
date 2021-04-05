import * as express from "express";
import { Post } from "../model/post.interface";
import postModel from "../model/posts.model";
import { Controller } from "./controller.interface";

class PostContoller implements Controller {

    path: string = '/post';
    router: express.Router = express.Router();
    private post = postModel;

    constructor() {
        this.initializeRoutes();
    }
    
    private initializeRoutes() {
        this.router.get(this.path, this.getAllPosts);
        this.router.get(`${this.path}/:id`, this.getPostById);
        this.router.post(this.path, this.createPost);
        this.router.patch(`${this.path}/:id`, this.modifyPost);
        this.router.delete(`${this.path}/:id`, this.deletePost);
    }
    
    private getPostById = (request: express.Request, response: express.Response): void => {
        const postId = request.params.id;
        
        this.post.findById(postId)
            .then((post) => response.send(post));
    };

    private getAllPosts = (request: express.Request, response: express.Response): void => {
        this.post.find()
            .then((posts) => response.send(posts));
    };

    private createPost = (request: express.Request, response: express.Response): void => {
        const postData: Post = request.body;
        const createdPost = new this.post(postData);

        createdPost.save()
            .then((savedPost) => response.send(savedPost));
    }

    private modifyPost = (request: express.Request, response: express.Response): void => {
        const postId = request.params.id;
        const postData: Post = request.body;

        this.post.findByIdAndUpdate(postId, postData, { new: true })
            .then((post) => response.send(post));
    }

    private deletePost = (request: express.Request, response: express.Response): void => {
        const postId = request.params.id;

        this.post.findByIdAndDelete(postId)
            .then((successResponse) => {
                if (successResponse) {
                    response.send(200);
                } else {
                    response.send(404);
                }
            });
    }

}

export default PostContoller;