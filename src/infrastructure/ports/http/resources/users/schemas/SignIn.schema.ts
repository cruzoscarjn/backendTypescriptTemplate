import { JSONSchemaType } from 'ajv';

export interface signInSchema {
  email: string;
  password: string;
}

const SignInSchema: JSONSchemaType<signInSchema> = {
  additionalProperties: false,
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: { type: 'string', format: 'email' },
    password: { type: 'string', minLength: 8 },
  },
};

export default SignInSchema;
