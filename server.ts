import url from 'url';
import path from 'path';
import nextjs from 'next';
import cors from 'cors';
import express from 'express';
import { buildSchema } from 'type-graphql';
import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import Multer from 'multer';

import postgredb from './infrastructure/db/postgre';
import session from './infrastructure/helpers/session';
import { ApolloHandler } from './infrastructure/exceptions/apollo-handler';
import { Authenticated } from './infrastructure/middleware/is-auth';

const PORT = parseInt(process.env.PORT || '3000', 10);
const DEV = process.env.NODE_ENV !== 'production';
const DOMAIN = !DEV ? process.env.DOMAIN : undefined;
const HOSTNAME = !DEV ? process.env.HOSTNAME || 'localhost' : '0.0.0.0';

const nextApp = nextjs({ dev: DEV });
const nextHandler = nextApp.getRequestHandler();

const upload = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // no larger than 256mb
  },
});

nextApp.prepare().then(async () => {
  const server = express();

  /* Disclosing technology fingerprints allows an attacker to gather information
   * about the technologies used to develop the web application and to perform relevant
   * security assessments more quickly (like the identification of known vulnerable components).
   */
  server.disable('x-powered-by');

  if (!DEV) {
    // Enforce SSL & HSTS in production
    server.use(function (req, res, next) {
      const proto = req.headers['x-forwarded-proto'];
      if (proto === 'https') {
        res.set({
          'Strict-Transport-Security': 'max-age=31557600', // one-year
        });
        return next();
      }
      res.redirect('https://' + req.headers.host + req.url);
    });
  }

  // Cross-origin resource sharing
  server.use(
    cors({
      origin: process.env.CORS_ORIGIN || '*',
      credentials: true,
    }),
  );

  // Session Storage
  server.set('trust proxy', 1);
  server.use(
    session({
      name: process.env.COOKIE_NAME || 'cookie',
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        sameSite: 'lax', // csrf
        secure: !DEV, // cookie only works in https
        domain: DOMAIN,
      },
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET || 'secret',
      resave: false,
    }),
  );

  // Add middleware authorization
  server.use(async function (req, _res, next) {
    try {
      req.session.idToken = req.headers?.authorization?.split('Bearer ')[1];
      next();
    } catch (error) {
      next();
    }
  });

  // Static files
  // https://github.com/zeit/next.js/tree/4.2.3#user-content-static-file-serving-eg-images
  server.use(
    '/public',
    express.static(path.join(__dirname, 'public'), { maxAge: DEV ? '0' : '365d' }),
  );

  const schema = await buildSchema({
    resolvers: [__dirname + '/domain/graphql/**/*.ts'],
  });

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }) => ({
      req,
      res,
      idToken: req.headers?.authorization?.split('Bearer ')[1],
    }),
    formatError: ApolloHandler.formatError,
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground({})],
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({
    app: server,
    cors: false,
  });

  // Default catch-all renders Next app
  server.get('*', (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    nextHandler(req, res, parsedUrl);
  });

  server.post('*', Authenticated, upload.any(), (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    nextHandler(req, res, parsedUrl);
  });

  postgredb
    .then(_connection => {
      server.listen(PORT, HOSTNAME, () => {
        // tslint:disable-next-line:no-console
        console.log(
          `🚀 Server listening at http://${HOSTNAME}:${PORT} as ${DEV ? 'development' : DEV}`,
        );
      });
    })
    .catch(err => {
      console.log('Unable to connect to db', err);
      process.exit(1);
    });
});
