import SignInSchema from '../http/resources/users/schemas/SignIn.schema';
import SignInResponseSchema from '../http/resources/users/schemas/SignInResponse.schema';
import SignUpSchema from '../http/resources/users/schemas/SignUp.schema';
import SignUpResponseSchema from '../http/resources/users/schemas/SignUpResponse.schema';
import HttpErrorSchema from '../http/schemas/HttpError.schema';

const CommonDefinition = {
  components: {
    schemas: {
      HttpErrorSchema,
      SignInResponseSchema,
      SignInSchema,
      SignUpResponseSchema,
      SignUpSchema,
    },
    responses: {
      '4XX': {
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/HttpErrorSchema',
            },
          },
        },
      },
      '5XX': {
        description: '5xx Errors, if it is thrown inside the application it will have this shape, however could be empty.',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/HttpErrorSchema',
            },
          },
        },
      },
      default: {
        description: 'Unexpected error It could have any shape.',
      },
    },
  },
};

export default CommonDefinition;
