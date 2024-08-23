// export async function createSession(user: User, sessionTime: number): Promise<UserSession> {
//   const sessionExpiration = new Date(Date.now() + sessionTime);

import UserEntity from '#domain/users/User.entity';

interface AuthService {
  createAccessToken: (user: UserEntity) => string;
  getSessionDate: () => Date;
  encryptPassword: (password: string) => Promise<string>;
  validatePassword: (password: string, encryptedPassword: string) => Promise<boolean>;
}

export default AuthService;
