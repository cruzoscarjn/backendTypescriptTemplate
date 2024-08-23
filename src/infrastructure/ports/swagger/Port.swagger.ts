import express from 'express';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUiExpress, { SwaggerUiOptions } from 'swagger-ui-express';

import Logger from '#composition/Logger';
import EnvConfiguration from '#infrastructure/configurations/Env.configuration';

import CommonDefinition from './CommonDefinition';

const { SWAGGER_PORT, PORT } = EnvConfiguration.getEnv();
const logger = Logger.getLogger();

function init(): void {
  const app = express();

  const swaggerSpec = swaggerJsDoc({
    definition: {
      openapi: '3.1.0',
      info: {
        title: 'Server Documentation',
        version: '1.0.0',
      },
      servers: [{
        url: `http://localhost:${PORT}`,
        describe: 'Dev server',
      }],
      ...CommonDefinition,
    },
    apis: ['./src/infrastructure/ports/http/resources/**/*.controller.ts'],
  });

  const swaggerOpts: SwaggerUiOptions = {
    explorer: true,
  };

  app.use('/', swaggerUiExpress.serve, swaggerUiExpress.setup(swaggerSpec, swaggerOpts));

  app.listen(SWAGGER_PORT, () => {
    logger.info(`Swagger server listening on ${SWAGGER_PORT}`);
  });
}

export default {
  init,
};
