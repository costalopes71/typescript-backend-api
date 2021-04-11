import { cleanEnv, str, port} from "envalid";

process.env.PORT = '5000';
process.env.MONGO_USER = 'developer';
process.env.MONGO_PASSWORD = '123456';
process.env.MONGO_PATH = 'localhost:27017/tutorial';
process.env.JWT_SECRET = 'jwtsecret';

export function validateEnv() {
    cleanEnv(process.env, {
        MONGO_PASSWORD: str(),
        MONGO_PATH: str(),
        MONGO_USER: str(),
        PORT: port(),
    });
}