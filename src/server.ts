import { authenticationInitialize, authenticationSession } from './controllers/authenticationController';
import express, { Request, Response, ErrorRequestHandler } from 'express';
import morgan from "morgan";
import helmet from "helmet";
import cors from 'cors';
import { configuration, IConfig } from "./config";
import { connect } from './database';
import generalRouter from './routes/router';
import session from 'express-session';
import mongoose from 'mongoose';
import connect_mongo from 'connect-mongo';
const MongoStore = connect_mongo(session);

export function createExpressApp(config: IConfig): express.Express {
  const { express_debug, session_cookie_name, session_secret } = config;

  const app = express();

  app.use(morgan('combined'));
  app.use(helmet());
  app.use(express.json());

  // cors
  app.use(cors({
    origin: true,
    credentials: true
  }));
  //app.use(express.urlencoded({ extended: true }));
  /* app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  }); */

  // session
  app.use(session({
    name: session_cookie_name,
    secret: session_secret,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    saveUninitialized: false,
    resave: false
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
