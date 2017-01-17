import './__workaround.node.ts';
import 'angular2-universal-polyfills';
import 'ts-helpers';

import * as path from 'path';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as morgan from 'morgan';
import * as compression from 'compression';

import { enableProdMode } from '@angular/core';

import { createEngine } from 'angular2-express-engine';

import { ServerModule } from './app/server.module';

// Routes
//import { routes } from './server.routes';

//enableProdMode();

declare const Zone;

const app = express();

const ROOT = path.join(path.resolve(__dirname, '..'));

app.engine('.html', createEngine({
  ngModule: ServerModule,
  providers: []
}));

app.set('port', process.env.PORT || 8080);
app.set('views', __dirname);
app.set('view engine', 'html');
app.set('json spaces', 2);

app.use(cookieParser('Angular 2 Universal'));
app.use(bodyParser.json());
app.use(compression());

app.use(morgan('dev'));

function cacheControl(req, res, next) {
  res.header('Cache-Control', 'max-age=60');
  next();
}

app.use('/assets', cacheControl, express.static(path.join(__dirname, 'assets'), {maxAge: 30}));
app.use(cacheControl, express.static(path.join(ROOT, 'dist/client'), {index: false}));

process.on('uncaughtException', function (err) {
  console.error('Catching uncaught errors to avoid process crash', err);
});

function ngApp(req, res) {
  function onHandleError(parentZoneDelegate, currentZone, targetZone, error)  {
    console.warn('Error in SSR, serving for direct CSR');
    res.sendFile('index.html', {root: path.join(ROOT, 'src')});
    return false;
  }

  Zone.current.fork({ name: 'CSR fallback', onHandleError }).run(() => {
    res.render('index', {
      req,
      res,
      // time: true, // use this to determine what part of your app is slow only in development
      preboot: false,
      baseUrl: '/',
      requestUrl: req.originalUrl,
      originUrl: `http://localhost:${app.get('port')}`
    });
  });
}

/**
 * use universal for specific routes
 */
app.get('/', ngApp);
// routes.forEach(route => {
//   app.get(`/${route}`, ngApp);
//   app.get(`/${route}/*`, ngApp);
// });

app.get('*', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  var pojo = { status: 404, message: 'No Content' };
  var json = JSON.stringify(pojo, null, 2);
  res.status(404).send(json);
});

// Server
let server = app.listen(app.get('port'), () => {
  console.log(`Listening on: http://localhost:${server.address().port}`);
});

