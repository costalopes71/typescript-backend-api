import { NextFunction, Response } from "express";
import { RequestWithUser } from "../interfaces/requestwithuser.interface";
import * as jwt from "jsonwebtoken";
import { DataStoredInToken } from "../authentication/datastoreintoken.interface";
import userModel from "../user/user.model";
import { WrongAuthenticationTokenException } from "../exceptions/WrongAuthenticationTokenException";
import { AuthenticationTokenMissingException } from "../exceptions/AuthenticationTokenMissingException";


async function authMiddleware(request: RequestWithUser, reponse: Response, next: NextFunction) {

    const cookies = request.cookies;

    if (cookies && cookies.Authorization) {

        const secret = process.env.JWT_SECRET!;
        try {
            const verificationResponse = jwt.verify(cookies.Authorization, secret) as DataStoredInToken;
            const id = verificationResponse._id;
            const user = await userModel.findById(id);

            if (user) {
                request.user = user;
                next();
            } else {
                next(new WrongAuthenticationTokenException());
            }

        } catch (error) {
            next(new WrongAuthenticationTokenException());
        }

    } else {
        next(new AuthenticationTokenMissingException());
    }

}

export default authMiddleware;