import { JSONSchemaType } from 'ajv';

export interface metaSchema {
  errors: Record<string, unknown>[];
}

export interface httpErrorSchema {
  statusCode: number;
  message: string;
  meta: metaSchema;
}

const HttpErrorSchema: JSONSchemaType<httpErrorSchema> = {
  additionalProperties: false,
  type: 'object',
  required: ['statusCode', 'message', 'meta'],
  properties: {
    statusCode: { type: 'number' },
    message: { type: 'string' },
    meta: {
      type: 'object',
      required: ['errors'],
      properties: {
        errors: {
          type: 'array',
          minItems: 0,
          items: {
            type: 'object',
          },
        },
      },
    },
  },
};

export default HttpErrorSchema;
