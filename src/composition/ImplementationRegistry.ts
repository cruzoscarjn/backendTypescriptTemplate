import UserRepository from '#application/users/repositories/User.Repository';
import AuthService from '#application/users/services/Auth.service';
import CoreUserRepository from '#infrastructure/implementation/user/CoreUser.Repository';
import JWTAuthService from '#infrastructure/implementation/user/JWTAuth.service';

// Service factory containing all system service registry implementations
const UserRepository: UserRepository = CoreUserRepository;

const AuthService: AuthService = JWTAuthService;

const Registry = {
  UserRepository,
  AuthService,
};

export default Registry;
