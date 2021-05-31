import 'module-alias/register';
import './utilities/Env';

import express, { urlencoded, json } from 'express';
import { getLogger } from 'log4js';

import Routes from '@/Routes';
import { loggerMiddleware } from '@middlewares/LoggerMiddleware';
import { initLogger } from '@utilities/Logger';
import { ErrorHandler } from '@middlewares/ErrorHandlerMiddleware';
import cookieParser from 'cookie-parser';

const { LOG_LVL = 'info', PORT = 3000 } = process.env;

const app = express();

initLogger(LOG_LVL);

app.use(cookieParser());
app.use(urlencoded({ extended: true }));
app.use(json());
app.use(loggerMiddleware);

app.use(Routes);

app.use(ErrorHandler);

app.listen(PORT, () => {
  getLogger().info('server listening on', PORT);
});
