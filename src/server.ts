import { validateEnv } from './utils/validateEnv';
import App from './app';
import PostContoller from './controllers/post.controller';
import AuthenticationController from './authentication/authentication.controller';
import { UserController } from './controllers/user.controller';

validateEnv();

const app = new App([new PostContoller(), new UserController(), new AuthenticationController()], 5000);

app.listen();
