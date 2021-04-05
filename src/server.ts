import { validateEnv } from './utils/validateEnv';
import App from './app';
import PostContoller from './controllers/post.controller';

validateEnv();

const app = new App([new PostContoller()], 5000);

app.listen();
