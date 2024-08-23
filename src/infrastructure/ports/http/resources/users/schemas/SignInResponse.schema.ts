import { JSONSchemaType } from 'ajv';

export interface signInResponseSchema {
  accessToken: string;
}

const SignInResponseSchema: JSONSchemaType<signInResponseSchema> = {
  type: 'object',
  required: ['accessToken'],
  properties: {
    accessToken: { type: 'string' },
  },
  additionalProperties: false,
};

export default SignInResponseSchema;
