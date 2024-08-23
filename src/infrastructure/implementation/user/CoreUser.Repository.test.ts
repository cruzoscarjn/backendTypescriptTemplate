import SessionEntity from '#domain/users/Session.entity';
import UserEntity from '#domain/users/User.entity';
import CoreDatabase from '#infrastructure/databases/core/Core.database';
import CoreUserRepository from '#infrastructure/implementation/user/CoreUser.Repository';

jest.unmock('#infrastructure/implementation/user/CoreUser.Repository');

describe('CoreUserRepository', () => {
  const db = CoreDatabase.getClient();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findOneByEmail', () => {
    it('should find a user by email', async () => {
      const email = 'test@example.com';
      await CoreUserRepository.findOneByEmail(email);
      expect(db.select).toHaveBeenCalledWith(['id', 'email', 'name', 'password']);
      expect(db.from).toHaveBeenCalledWith('users');
      expect(db.where).toHaveBeenCalledWith({ email });
    });
  });

  describe('createOne', () => {
    it('should create a user', async () => {
      const user = { email: 'new@example.com', name: 'New User', password: 'password123' };
      await CoreUserRepository.createOne(user);
      expect(db.insert).toHaveBeenCalledWith(user);
      expect(db.into).toHaveBeenCalledWith('users');
    });
  });

  describe('createSession', () => {
    it('should create a session for a user', async () => {
      const user = {
        id: '1', email: 'test@example.com', name: 'Test User', password: 'password123',
      };
      const expiresAt = new Date();
      await CoreUserRepository.createSession(user, expiresAt);
      expect(db.insert).toHaveBeenCalledWith({ userId: user.id, expiresAt });
      expect(db.into).toHaveBeenCalledWith('user_sessions');
    });
  });

  describe('getSessionById', () => {
    it('should retrieve a session by ID for a user', async () => {
      const user = { id: '1' } as UserEntity;
      const sessionId = 'session1';
      await CoreUserRepository.getSessionById(user, sessionId);
      expect(db.select).toHaveBeenCalledWith(['id', 'userId', 'expiresAt']);
      expect(db.from).toHaveBeenCalledWith('user_sessions');
      expect(db.where).toHaveBeenCalledWith('userId', user.id);
      expect(db.andWhere).toHaveBeenCalledWith('id', sessionId);
    });
  });

  describe('deleteSession', () => {
    it('should delete a session for a user', async () => {
      const user = { id: '1' } as UserEntity;
      const session = { id: 'session1' } as SessionEntity;
      await CoreUserRepository.deleteSession(user, session);
      expect(db.delete).toHaveBeenCalled();
      expect(db.from).toHaveBeenCalledWith('user_sessions');
      expect(db.where).toHaveBeenCalledWith('userId', user.id);
      expect(db.andWhere).toHaveBeenCalledWith('id', session.id);
    });
  });

  describe('findOneById', () => {
    it('should find a user by ID', async () => {
      const id = '1';
      await CoreUserRepository.findOneById(id);
      expect(db.select).toHaveBeenCalledWith(['id', 'email', 'name', 'password']);
      expect(db.from).toHaveBeenCalledWith('users');
      expect(db.where).toHaveBeenCalledWith('id', id);
    });
  });
});
