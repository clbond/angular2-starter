import 'angular2-universal-polyfills';
import 'ts-helpers';

import './server.hotfix';

import * as path from 'path';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as morgan from 'morgan';
import * as compression from 'compression';

import { createEngine } from 'angular2-express-engine';

import { ServerModule } from './app/server.module';

//import { routes } from './server.routes';

declare const Zone;

const app = express();

const ROOT = path.resolve(path.join(__dirname, '..'));

app.engine('.html',
  createEngine({
    ngModule: ServerModule,
    providers: [],
  }));

app.set('port', process.env.PORT || 8080);
app.set('views', __dirname);
app.set('view engine', 'html');
app.set('json spaces', 2);

app.use(cookieParser('Angular 2 Universal'));
app.use(bodyParser.json());
app.use(compression());

app.use(morgan('dev'));

const cacheControl = (req, res, next) => {
  res.header('Cache-Control', 'max-age=60');
  next();
};

app.use('/assets', cacheControl, express.static(path.join(__dirname, 'assets'), {maxAge: 30}));

app.use(cacheControl, express.static(path.join(ROOT, 'dist/client'), {index: false}));

process.on('uncaughtException', err =>
  console.error('Catching uncaught errors to avoid process crash', err));

app.get('/', (req, res) => {
  const onHandleError = (parentZoneDelegate, currentZone, targetZone, error) => {
    console.warn('Error in SSR, serving for direct CSR');
    res.sendFile('index.html', {root: path.join(ROOT, 'src')});
    return false;
  };

  Zone.current.fork({ name: 'CSR fallback', onHandleError }).run(() => {
    res.render('index', {
      req,
      res,
      preboot: false,
      baseUrl: '/',
      requestUrl: req.originalUrl,
      originUrl: `http://localhost:${app.get('port')}`
    });
  });
});

// routes.forEach(route => {
//   app.get(`/${route}`, ngApp);
//   app.get(`/${route}/*`, ngApp);
// });

app.get('*', (req, res) => {
  const pojo = { status: 404, message: 'No Content' };

  res.setHeader('Content-Type', 'application/json');

  res.status(404).send(JSON.stringify(pojo, null, 2));
});

const server = app.listen(app.get('port'), () =>
  console.log(`Listening on: http://localhost:${server.address().port}`));
