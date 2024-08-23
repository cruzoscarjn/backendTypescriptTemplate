import UserRepository from '#application/users/repositories/User.Repository';
import AuthService from '#application/users/services/Auth.service';

const user = {
  id: '1', password: 'password', email: 'email', name: 'name',
};

const session = {
  id: '1', expiresAt: new Date(),
};

const userRepository: UserRepository = {
  findOneById: jest.fn().mockResolvedValue(user),
  createSession: jest.fn().mockResolvedValue(session),
  getSessionById: jest.fn().mockResolvedValue(session),
  deleteSession: jest.fn(),
  findOneByEmail: jest.fn().mockResolvedValue(user),
  createOne: jest.fn(),
};

const AuthService: AuthService = {
  createAccessToken: jest.fn().mockReturnValue('accessToken'),
  encryptPassword: jest.fn().mockResolvedValue('encryptedPassword'),
  validatePassword: jest.fn().mockResolvedValue(true),
  getSessionDate: jest.fn().mockReturnValue(new Date(session.expiresAt.getTime() - 1000)),
};

export default {
  UserRepository: userRepository,
  AuthService,
};
