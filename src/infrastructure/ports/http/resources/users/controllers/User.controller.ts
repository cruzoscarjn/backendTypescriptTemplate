import { Request, Response } from 'express';

import SignInCommand from '#application/users/commands/SignIn.command';
import SignUpCommand from '#application/users/commands/SignUp.command';
import UserService from '#application/users/services/User.Service';
import EnvConfiguration from '#infrastructure/configurations/Env.configuration';
import ErrorsHttp from '#infrastructure/ports/http/Errors.http';
import SchemasValidatorUtility from '#infrastructure/utilities/SchemasValidator.utility';

import SignInSchema, { signInSchema } from '../schemas/SignIn.schema';
import { signInResponseSchema } from '../schemas/SignInResponse.schema';
import SignUpSchema, { signUpSchema } from '../schemas/SignUp.schema';
import { signUpResponseSchema } from '../schemas/SignUpResponse.schema';

/**
   * @openapi
   * /users/sign-up:
   *   post:
   *     description: Register a new user, this endpoint is private and only available for admins
   *     tags:
   *       - Users
   *     summary: Register a new user
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: "#/components/schemas/SignUpSchema"
   *     responses:
   *       "200":
   *         description: User created
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/SignUpResponseSchema"
   *       "400":
   *         description: Invalid input, review the schema.
   *         $ref: "#/components/responses/4XX"
   *       "409":
   *         description: User already exist.
   *         $ref: "#/components/responses/4XX"
   *       "5XX":
   *         $ref: "#/components/responses/5XX"
 */
async function signUp(req: Request<unknown, unknown, signUpSchema>, res: Response): Promise<Response<signUpResponseSchema>> {
  const { body } = req;

  SchemasValidatorUtility.schemasValidation(SignUpSchema, body);

  const { email, name, password } = body;

  const command: SignUpCommand = {
    email,
    name,
    password,
  };

  const user = await UserService.signUp(command);

  return res.send(user);
}

/**
   * @openapi
   * /users/sign-in:
   *   post:
   *     description: Sign in user
   *     tags:
   *       - Users
   *     summary: Sign in user
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: "#/components/schemas/SignInSchema"
   *     responses:
   *       "200":
   *         description: User signed in
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/SignInResponseSchema"
   *       "400":
   *         description: Invalid input, review the schema.
   *         $ref: "#/components/responses/4XX"
   *       "401":
   *         description: Invalid credentials.
   *         $ref: "#/components/responses/4XX"
   *       "5XX":
   *         $ref: "#/components/responses/5XX"
 */
async function signIn(req: Request<unknown, unknown, signInSchema>, res: Response<signInResponseSchema>): Promise<Response<signInResponseSchema>> {
  const { body } = req;

  SchemasValidatorUtility.schemasValidation(SignInSchema, body);

  const { email, password } = body;

  const command: SignInCommand = {
    email,
    password,
  };

  const authKeys = await UserService.signIn(command);

  const cookieOpts = !EnvConfiguration.getEnv().IS_DEV ? { secure: true, httpOnly: true, sameSite: true } : {};

  res.cookie('SESSION_ID', authKeys.sessionId, cookieOpts);

  return res.send({ accessToken: authKeys.accessToken });
}

/**
   * @openapi
   * /users/sign-out:
   *   post:
   *     description: Sign out user
   *     tags:
   *       - Users
   *     summary: Sign out user
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       "200":
   *         description: User signed out
   *       "404":
   *         description: Session not found or User not found.
   *         $ref: "#/components/responses/4XX"
   *       "5XX":
   *         $ref: "#/components/responses/5XX"
 */
async function signOut(req: Request, res: Response): Promise<Response> {
  const { cookies: { SESSION_ID }, authorization } = req;

  if (!SESSION_ID) {
    throw new ErrorsHttp.NotFound('Session not found');
  }

  await UserService.signOut({ sessionId: SESSION_ID, userId: authorization.userId });

  res.clearCookie('SESSION_ID');

  return res.send();
}

/**
   * @openapi
   * /users/refresh-token:
   *   post:
   *     description: Refresh token
   *     tags:
   *       - Users
   *     summary: Refresh token
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       "200":
   *         description: Token refreshed
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/SignInResponseSchema"
   *       "400":
   *         description: Session not found.
   *         $ref: "#/components/responses/4XX"
   *       "5XX":
   *         $ref: "#/components/responses/5XX"
 */
async function refreshToken(req: Request, res: Response<signInResponseSchema>): Promise<Response<signInResponseSchema>> {
  const { cookies: { SESSION_ID }, authorization } = req;

  if (!SESSION_ID) throw new ErrorsHttp.BadRequest('Session not found');

  const accessToken = await UserService.refreshToken({ sessionId: SESSION_ID, userId: authorization.userId });

  return res.send({ accessToken });
}

const UserController = {
  signUp,
  signIn,
  signOut,
  refreshToken,
};

export default UserController;
