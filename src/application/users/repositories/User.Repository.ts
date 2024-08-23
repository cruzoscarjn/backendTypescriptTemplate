import SessionEntity from '#domain/users/Session.entity';
import UserEntity from '#domain/users/User.entity';

export type CreateUser = Omit<UserEntity, 'id'>;

interface UserRepository {
  findOneByEmail(email: string): Promise<UserEntity | undefined>;
  createOne(user: CreateUser): Promise<Omit<UserEntity, 'password'>>;
  createSession(user: UserEntity, expiresAt: Date): Promise<SessionEntity>;
  getSessionById(user: UserEntity, sessionId: string): Promise<SessionEntity | undefined>;
  deleteSession(user: UserEntity, session: SessionEntity): Promise<void>;
  findOneById(id: string): Promise<UserEntity | undefined>;
}

export default UserRepository;
