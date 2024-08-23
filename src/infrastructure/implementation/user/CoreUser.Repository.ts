import UserRepository, { CreateUser } from '#application/users/repositories/User.Repository';
import SessionEntity from '#domain/users/Session.entity';
import UserEntity from '#domain/users/User.entity';
import TableNamesConfiguration from '#infrastructure/configurations/TableNames.configuration';
import CoreDatabase from '#infrastructure/databases/core/Core.database';

const db = CoreDatabase.getClient();

const { USERS, USER_SESSIONS } = TableNamesConfiguration;

const userSelect: Array<keyof UserEntity> = ['id', 'email', 'name', 'password'];
const sessionSelect: Array<keyof SessionEntity> = ['id', 'userId', 'expiresAt'];
const allowedSelect: Array<keyof UserEntity> = ['id', 'email', 'name'];

async function findOneByEmail(email: string): Promise<UserEntity | undefined> {
  return db
    .select(userSelect)
    .from(USERS)
    .where({ email })
    .first();
}

async function createOne(user: CreateUser): Promise<Omit<UserEntity, 'password'>> {
  return (await db.insert(user).into(USERS).returning(userSelect).returning(allowedSelect))[0];
}

async function createSession(user: UserEntity, expiresAt: Date): Promise<SessionEntity> {
  return (
    await db.insert({ userId: user.id, expiresAt }).into(USER_SESSIONS).returning('*')
  )[0];
}

function getSessionById(user: UserEntity, sessionId: string): Promise<SessionEntity> {
  return db.select(sessionSelect).from(USER_SESSIONS).where('userId', user.id).andWhere('id', sessionId)
    .first<SessionEntity>();
}

async function deleteSession(user: UserEntity, session: SessionEntity): Promise<void> {
  await db.delete().from(USER_SESSIONS).where('userId', user.id).andWhere('id', session.id);
}

function findOneById(id: string): Promise<UserEntity | undefined> {
  return db.select(userSelect).from(USERS).where('id', id).first<UserEntity>();
}

const CoreUserRepository: UserRepository = {
  findOneByEmail,
  createOne,
  createSession,
  getSessionById,
  deleteSession,
  findOneById,
};

export default CoreUserRepository;
