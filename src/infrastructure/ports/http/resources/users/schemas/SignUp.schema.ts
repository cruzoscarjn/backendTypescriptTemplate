import { JSONSchemaType } from 'ajv';

export interface signUpSchema {
  name: string;
  email: string;
  password: string;
}

const SignUpSchema: JSONSchemaType<signUpSchema> = {
  type: 'object',
  required: ['name', 'email', 'password'],
  properties: {
    name: { type: 'string' },
    email: { type: 'string', format: 'email' },
    password: { type: 'string', minLength: 12 },
  },
  additionalProperties: false,
};

export default SignUpSchema;
