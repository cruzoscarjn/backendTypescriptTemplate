import Cause from '#composition/Cause.type';
import Registry from '#composition/ImplementationRegistry';
import UserEntity from '#domain/users/User.entity';

import RefreshCommand from '../commands/Refresh.command';
import SignInCommand from '../commands/SignIn.command';
import SignOutCommand from '../commands/SignOut.command';
import SignUpCommand from '../commands/SignUp.command';

async function signUp(signUpCommand: SignUpCommand): Promise<Omit<UserEntity, 'password'>> {
  const { email, name, password } = signUpCommand;

  const existingUser = await Registry.UserRepository.findOneByEmail(email);

  if (existingUser) {
    throw new Error('User with this email already exist', { cause: Cause.CONFLICT });
  }

  const encryptedPassword = await Registry.AuthService.encryptPassword(password);

  const user = await Registry.UserRepository.createOne({ email, name, password: encryptedPassword });

  return user;
}

export async function signIn(signInCommand: SignInCommand): Promise<{accessToken: string, sessionId: string}> {
  const currentUser = await Registry.UserRepository.findOneByEmail(signInCommand.email);

  if (!currentUser) {
    throw new Error('User not found', { cause: Cause.NOT_FOUND });
  }

  const isValidPassword = await Registry.AuthService.validatePassword(signInCommand.password, currentUser.password);

  if (!isValidPassword) {
    throw new Error('Invalid Credentials', { cause: Cause.UNAUTHORIZED });
  }

  const accessToken = Registry.AuthService.createAccessToken(currentUser);

  const expiresAt = Registry.AuthService.getSessionDate();

  const { id: sessionId } = await Registry.UserRepository.createSession(currentUser, expiresAt);

  return { accessToken, sessionId };
}

async function refreshToken(refreshCommand: RefreshCommand): Promise<string> {
  const currentUser = await Registry.UserRepository.findOneById(refreshCommand.userId);

  if (!currentUser) {
    throw new Error('User not found', { cause: Cause.NOT_FOUND });
  }

  const userSession = await Registry.UserRepository.getSessionById(currentUser, refreshCommand.sessionId);

  if (!userSession) throw new Error('Session not found', { cause: Cause.NOT_FOUND });

  if (userSession.expiresAt.getTime() < Date.now()) {
    await Registry.UserRepository.deleteSession(currentUser, userSession);

    throw new Error('Session expired', { cause: Cause.UNAUTHORIZED });
  }

  const accessToken = Registry.AuthService.createAccessToken(currentUser);

  return accessToken;
}

export async function signOut(signOutCommand: SignOutCommand): Promise<void> {
  const currentUser = await Registry.UserRepository.findOneById(signOutCommand.userId);

  if (!currentUser) {
    throw new Error('User not found', { cause: Cause.NOT_FOUND });
  }

  const currentSession = await Registry.UserRepository.getSessionById(currentUser, signOutCommand.sessionId);

  if (!currentSession) {
    throw new Error('Session not found', { cause: Cause.NOT_FOUND });
  }

  await Registry.UserRepository.deleteSession(currentUser, currentSession);
}

const UserService = {
  signUp,
  signIn,
  refreshToken,
  signOut,
};

export default UserService;
