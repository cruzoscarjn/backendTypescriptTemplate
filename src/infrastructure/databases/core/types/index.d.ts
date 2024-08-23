import { Knex } from 'knex';

import SessionEntity from '#domain/users/Session.entity';
import UserEntity from '#domain/users/User.entity';

interface commonColumns {
  createdAt: Date;
  updatedAt: Date;
}

type dbUser = UserEntity & commonColumns;
type dbSession = SessionEntity & commonColumns;

declare module 'knex/types/tables' {

  interface Tables {
   users: Knex.CompositeTableType<
    dbUser,
    UserEntity,
    Partial<Omit<UserEntity, 'id'>>
  >;
  user_sessions: Knex.CompositeTableType<dbSession,
    SessionEntity,
    Partial<Omit<SessionEntity, 'id'>>,
  >;
  }
}
