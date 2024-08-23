import Cause from '#composition/Cause.type';
import Registry from '#composition/ImplementationRegistry';
import UserEntity from '#domain/users/User.entity';

import UserService from './User.Service';

jest.unmock('./User.Service');

describe('UserService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('signUp', () => {
    it('creates a new user', async () => {
      (Registry.UserRepository.findOneByEmail as jest.Mock).mockResolvedValueOnce(null);
      const encryptedPassword = await Registry.AuthService.encryptPassword('password');

      const user = await UserService.signUp({ email: 'email', password: 'password', name: 'name' });
      expect(Registry.UserRepository.findOneByEmail).toHaveBeenCalledWith('email');
      expect(Registry.AuthService.encryptPassword).toHaveBeenCalledWith('password');
      expect(Registry.UserRepository.createOne).toHaveBeenCalledWith({ email: 'email', password: encryptedPassword, name: 'name' });

      expect(user).toBe(Registry.UserRepository.createOne({} as UserEntity));
    });

    it('throws an error if the user already exists', async () => {
      (Registry.UserRepository.findOneByEmail as jest.Mock).mockResolvedValueOnce({});

      await expect(UserService.signUp({ email: 'email', password: 'password', name: 'name' }))
        .rejects.toThrow(new Error('User with this email already exist', { cause: Cause.CONFLICT }));
    });
  });

  describe('signIn', () => {
    it('returns an access token and a session id for a valid user', async () => {
      const mockedUser = await Registry.UserRepository.findOneByEmail('any');
      const storedPassword = (mockedUser as UserEntity).password;
      const mockedSessionDAte = Registry.AuthService.getSessionDate();
      const mockedAccessToken = Registry.AuthService.createAccessToken({} as UserEntity);

      const accessToken = await UserService.signIn({ email: 'email', password: 'password' });
      expect(Registry.UserRepository.findOneByEmail).toHaveBeenCalledWith('email');
      expect(Registry.AuthService.validatePassword).toHaveBeenCalledWith('password', storedPassword);
      expect(Registry.AuthService.createAccessToken).toHaveBeenCalledWith(mockedUser);
      expect(Registry.AuthService.getSessionDate).toHaveBeenCalled();
      expect(Registry.UserRepository.createSession).toHaveBeenCalledWith(mockedUser, mockedSessionDAte);

      expect(accessToken).toEqual({ accessToken: mockedAccessToken, sessionId: '1' });
    });

    it('throws an error if the user is not found', async () => {
      (Registry.UserRepository.findOneByEmail as jest.Mock).mockResolvedValueOnce(null);

      await expect(UserService.signIn({ email: 'email', password: 'password' })).rejects.toThrow(new Error('User not found', { cause: Cause.NOT_FOUND }));
    });

    it('throws an error if the password is invalid', async () => {
      (Registry.AuthService.validatePassword as jest.Mock).mockResolvedValueOnce(false);

      await expect(UserService.signIn({ email: 'email', password: 'password' })).rejects.toThrow(new Error('Invalid Credentials', { cause: Cause.UNAUTHORIZED }));
    });
  });

  describe('refreshToken', () => {
    it('returns a new access token for a valid session', async () => {
      const mockedUser = await Registry.UserRepository.findOneById('any');

      const accessToken = await UserService.refreshToken({ userId: '1', sessionId: 'validSessionId' });
      expect(Registry.UserRepository.findOneById).toHaveBeenCalledWith('1');
      expect(Registry.UserRepository.getSessionById).toHaveBeenCalledWith(mockedUser, 'validSessionId');
      expect(Registry.AuthService.createAccessToken).toHaveBeenCalledWith(mockedUser);

      expect(accessToken).toBe(Registry.AuthService.createAccessToken({} as UserEntity));
    });

    it('throws an error if the user is not found', async () => {
      (Registry.UserRepository.findOneById as jest.Mock).mockResolvedValueOnce(null);

      await expect(UserService.refreshToken({ userId: '1', sessionId: 'validSessionId' })).rejects.toThrow(new Error('User not found', { cause: Cause.NOT_FOUND }));
    });

    it('throws an error if the session is not found', async () => {
      (Registry.UserRepository.getSessionById as jest.Mock).mockResolvedValueOnce(null);

      await expect(UserService.refreshToken({ userId: '1', sessionId: 'invalidSessionId' })).rejects.toThrow(new Error('Session not found', { cause: Cause.NOT_FOUND }));
    });

    it('throws an error if the session is expired', async () => {
      (Registry.UserRepository.getSessionById as jest.Mock).mockResolvedValueOnce({ expiresAt: new Date(0) });

      await expect(UserService.refreshToken({ userId: '1', sessionId: 'validSessionId' })).rejects.toThrow(new Error('Session expired', { cause: Cause.UNAUTHORIZED }));

      expect(Registry.UserRepository.deleteSession).toHaveBeenCalledWith(await Registry.UserRepository.findOneById('any'), { expiresAt: new Date(0) });
    });
  });

  describe('signOut', () => {
    it('deletes a session', async () => {
      const mockedUser = (await Registry.UserRepository.findOneById('1')) as UserEntity;
      const mockedSession = await Registry.UserRepository.getSessionById(mockedUser, '1');

      await UserService.signOut({ userId: '1', sessionId: '1' });
      expect(Registry.UserRepository.findOneById).toHaveBeenCalledWith('1');
      expect(Registry.UserRepository.getSessionById).toHaveBeenCalledWith(mockedUser, '1');
      expect(Registry.UserRepository.deleteSession).toHaveBeenCalledWith(mockedUser, mockedSession);
    });

    it('throws an error if the user is not found', async () => {
      (Registry.UserRepository.findOneById as jest.Mock).mockResolvedValueOnce(null);

      await expect(UserService.signOut({ userId: '1', sessionId: '1' })).rejects.toThrow(new Error('User not found', { cause: Cause.NOT_FOUND }));
    });

    it('throws an error if the session is not found', async () => {
      (Registry.UserRepository.getSessionById as jest.Mock).mockResolvedValueOnce(null);

      await expect(UserService.signOut({ userId: '1', sessionId: '1' })).rejects.toThrow(new Error('Session not found', { cause: Cause.NOT_FOUND }));
    });
  });
});
