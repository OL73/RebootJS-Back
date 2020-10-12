import { authenticationInitialize, authenticationSession } from './controllers/authenticationController';
import express, { Request, Response, ErrorRequestHandler } from 'express';
import morgan from "morgan";
import helmet from "helmet";
import { configuration, IConfig } from "./config";
import { connect } from './database';
import generalRouter from './routes/router';
import session from 'express-session';
import mongoose from 'mongoose';
import { MongoStore } from 'connect-mongo';


export function createExpressApp(config: IConfig): express.Express {
  const { express_debug, session_cookie_name, session_secret} = config;

  const app = express();

  app.use(morgan('combined'));
  app.use(helmet());
  app.use(express.json());

  // session
  app.use(session({
    name: session_cookie_name,
    secret: session_secret,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    saveUninitialized: false
  }));

  // on fait le lien entre passport(authentification) et la session
  app.use(authenticationInitialize());
  app.use(authenticationSession());

  app.use(((err, _req, res, _next) => {
    console.error(err.stack);
    res.status?.(500).send(!express_debug ? 'Oups' : err);
  }) as ErrorRequestHandler);

  app.get('/', (req: Request, res: Response) => { res.send('This is the boilerplate for Flint Messenger app') });

  // redirection vers router (generalRouter)
  app.use('/api', generalRouter);

  return app;
}

const config = configuration();
const { PORT } = config;
const app = createExpressApp(config);
connect(config).then(
  () => app.listen(PORT, () => console.log(`Flint messenger listening at ${PORT}`))
);
