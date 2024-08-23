import CoreDatabase from './Core.database';

export default {
  client: 'pg',
  connection: CoreDatabase.getConfiguration(),
};
