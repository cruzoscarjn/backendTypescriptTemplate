import Ajv from 'ajv';
import addFormats from 'ajv-formats';

import { ErrorMeta, HttpError } from './HttpErrors';

const ajv = addFormats(new Ajv({ removeAdditional: true }));

function formatError(errors): string {
  const validationError = errors[0];
  const { message, dataPath } = validationError;

  return `${dataPath ? `${dataPath.replace('.', '')} ` : ''}${message.replace('.', '')}`;
}

export interface PaginationPropertiesSchema {
  [propertyName: string]: {
    type: string;
    [extraProperty: string]: unknown;
  };
}

export function schemasValidation(schema: unknown, data: unknown): void {
  const validator = ajv.compile(schema);

  const isValid = validator(data);

  if (isValid) return;

  const errorMessage = formatError(validator.errors);

  throw new HttpError(errorMessage, 400, { errors: validator.errors as unknown as ErrorMeta[] });
}
