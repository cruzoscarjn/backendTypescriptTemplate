import { JSONSchemaType } from 'ajv';

export interface signUpResponseSchema {
  id: string;
  name: string;
  email: string;
}

const SignUpResponseSchema: JSONSchemaType<signUpResponseSchema> = {
  type: 'object',
  required: ['id', 'name', 'email'],
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    email: { type: 'string', format: 'email' },
  },
  additionalProperties: false,
};

export default SignUpResponseSchema;
