import { HttpException } from "./HttpException";

export class PostNotFoundException extends HttpException {

    constructor(public id: string) {
        super(404, `Post with id ${id} not found.`);
    }

}
