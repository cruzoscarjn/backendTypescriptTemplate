import './src/utilities/Env';

import Databases from './src/configs/Databases';

export = {
  client: 'pg',
  connection: Databases.main,
  migrations: {
    tableName: 'Migrations',
    directory: './src/databases/migrations',
  },
};
