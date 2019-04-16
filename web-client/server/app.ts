#!/usr/bin/env ts-node

import 'reflect-metadata';

const port = process.env.PORT || 5050;

import * as appInsights from 'applicationinsights';
import * as busboy from 'express-busboy';
import * as cors from 'cors';
import * as express from 'express';
import * as expressJwt from 'express-jwt';
import * as morgan from 'morgan';
import * as swaggerUi from 'swagger-ui-express';

import { Server } from 'typescript-rest';
import { Container } from 'typedi';

import {
  AlertController,
  AlertGroupController,
  BackupController,
  BillingController,
  CircuitController,
  DeviceInterfaceController,
  GraphController,
  HistoryController,
  HostController,
  ItemController,
  ManagedDeviceController,
  NetworkMapController,
  NotificationController,
  NotificationTypeController,
  ReleaseNotesController,
  ReportController,
  RootController,
  SNMPConfigController,
  SupportCaseController,
  TogglesController,
  UserController,
  VendorController,
  VendorFilesController,
  ProxyController,
  BillableDeviceController,
  CircuitPredictiveController
} from './modules';

import { AdminProtection, LogService, ConfigService } from './services';

const controllers = [
  AlertController,
  AlertGroupController,
  BackupController,
  BillingController,
  CircuitController,
  DeviceInterfaceController,
  GraphController,
  HistoryController,
  HostController,
  ItemController,
  ManagedDeviceController,
  NetworkMapController,
  NotificationController,
  NotificationTypeController,
  ReleaseNotesController,
  ReportController,
  RootController,
  SNMPConfigController,
  SupportCaseController,
  TogglesController,
  UserController,
  VendorController,
  VendorFilesController,
  ProxyController,
  BillingController,
  BillableDeviceController,
  CircuitPredictiveController
];

const config = Container.get(ConfigService).GetConfiguration();

const swaggerDocument = require('./docs/swagger.json');

appInsights.setup(config.appInsights.instrumentationKey)
  .setAutoDependencyCorrelation(false)
  .setAutoCollectRequests(true)
  .setAutoCollectPerformance(true)
  .setAutoCollectExceptions(true)
  .setAutoCollectDependencies(true)
  .setAutoCollectConsole(true)
  .setUseDiskRetryCaching(true);

appInsights.defaultClient.commonProperties = {
  environment: process.env.ENVIRONMENT,
  hostname: process.env.HOSTNAME,
  version: process.env.VERSION
};
appInsights.start();
const appInsightsClient = appInsights.defaultClient;

appInsightsClient.trackEvent({ name: 'starting up server logging' });

const jwtMiddleware = expressJwt({
  secret: config.jwtSecret,
  getToken: function fromHeaderOrQuerystring(req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
      return req.query.token;
    }

    return null;
  }
}).unless({
  path: [
    '/auth/salesforce/callback',
    '/status',
    /^\/swagger(\/.*)*$/,
    '/ping',
    '/user/login',
    '/user/token',
    '/user/resetpassword'
  ], useOriginalUrl: false
});

const corsOptions = {
  origin: config.webClientOrigin,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  headers: 'Authorization,FileType,Name,X-Requested-With,Content-Type',
  credentials: true
};

const app = express();
// rewrite /api out of requests to handle both local and aws
app.use((req, res, next) => {
  req.url = req.url.replace('/api/', '/');
  next();
});

app.use(cors(corsOptions));
app.use(jwtMiddleware);

app.use((req, res, next) => Container.get(AdminProtection).checkAdminRoutes(req, res, next));

Server.buildServices(app, ...controllers);

app.use(morgan('combined'));
busboy.extend(app, { upload: true });

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// This uploadsRouter is kind of a placeholder until we can figure out
// how to get file uploads working with the swagger interface.
const uploadsRouter = express.Router();
uploadsRouter.post('/vendor/:groupId/:vendor/files/upload',
  (request, response) => Container.get(VendorFilesController).uploadFile(request, response));

uploadsRouter.post('/network-map/upload/:groupId',
  (request, response) => Container.get(NetworkMapController).upload(request, response));

app.use('', uploadsRouter);

app.all('*', (request, response, next) => {
  response.status(404)
    .json({
      status: 'Error',
      message: 'Affiniti Network Assure - Route Not Found'
    });
});


if (process.env.NODE_ENV !== 'test') {
  // New up one of each of the controllers to make sure that all of the DI stuff gets
  // settled at startup, and not wait until a request actually comes in.
  controllers.forEach(x => Container.get(x));

  app.listen(port, () => {
    console.log(`Affiniti Network Assure API listening on port ${port}`);
  });
}

export default app;
