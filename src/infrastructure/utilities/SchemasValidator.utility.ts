import Ajv, { AnySchema, ErrorObject } from 'ajv';
import addFormats from 'ajv-formats';

import { HttpError } from '../ports/http/Errors.http';

interface SchemaValidatorUtility {
  schemasValidation(schema: AnySchema, data: unknown): void;
}

const ajv = addFormats(new Ajv({ removeAdditional: true, allErrors: true }));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatErrors(errors: ErrorObject[]): { message: string | undefined; path: string }[] {
  const formattedErrors = errors.map((error) => ({ message: error.message, path: error.instancePath }));

  return formattedErrors;
}

function schemasValidation(schema: AnySchema, data: unknown): void {
  const validator = ajv.compile(schema);

  const isValid = validator(data);

  if (isValid) return;

  throw new HttpError('Validation Error', 400, { errors: formatErrors(validator.errors || []) });
}

const SchemasValidatorUtility: SchemaValidatorUtility = {
  schemasValidation,
};

export default SchemasValidatorUtility as SchemaValidatorUtility;
