import { plainToClass } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { HttpException } from "../exceptions/HttpException";
import { RequestHandler } from "express";

function validationMiddleware<T>(type: any, skipMissingProperties = false): RequestHandler {

    return (req, res, next) => {
        validate(plainToClass(type, req.body), { skipMissingProperties })
            .then((errors: ValidationError[]) => {
                if (errors.length > 0) {
                    const message = errors.map(error => Object.values(error.constraints!)).join(',');
                    next(new HttpException(400, message));
                } else {
                    next();
                }
            });
    };

}

export default validationMiddleware;