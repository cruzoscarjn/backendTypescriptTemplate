import { JSONSchemaType } from 'ajv/dist/core';

import { HttpError } from '#infrastructure/ports/http/Errors.http';
import SchemasValidatorUtility from '#infrastructure/utilities/SchemasValidator.utility';

jest.unmock('#infrastructure/utilities/SchemasValidator.utility');
jest.unmock('#infrastructure/ports/http/Errors.http');

const validatorMock = jest.fn();

const baseErrors = [{
  message: 'Error message',
  instancePath: 'name',
}];

jest.mock('ajv-formats', () => jest.fn().mockImplementation(() => ({
  compile: jest.fn(() => validatorMock),
})));

describe('SchemasValidatorUtility', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (validatorMock as unknown as {errors: typeof baseErrors}).errors = [{
      message: 'Error message',
      instancePath: 'name',
    }];
  });

  describe('schemasValidation', () => {
    const schema: JSONSchemaType<{name: string}> = {
      type: 'object',
      required: ['name'],
      properties: {
        name: { type: 'string' },
      },
    };

    it('should not throw an error if the data is valid', () => {
      validatorMock.mockReturnValue(true);

      const validData = {
        name: 'Test name',
      };

      expect(() => {
        SchemasValidatorUtility.schemasValidation(schema, validData);
      }).not.toThrow();
    });

    it('should throw an HttpError with status code 400 if the data is invalid', () => {
      validatorMock.mockReturnValue(false);
      const invalidData = {};

      const error = new HttpError('Validation Error', 400, {
        errors: baseErrors.map((bError) => ({ message: bError.message, path: bError.instancePath })),
      });

      try {
        SchemasValidatorUtility.schemasValidation(schema, invalidData);
        throw (new Error('This should not be called'));
      } catch (e) {
        expect((e as HttpError).statusCode).toEqual(error.statusCode);
        expect((e as HttpError).message).toEqual(error.message);
        expect((e as HttpError).meta).toEqual(error.meta);
      }
    });

    it('should throw an HttpError with status code 400 if the data is invalid and there are no errors', () => {
      validatorMock.mockReturnValue(false);
      (validatorMock as unknown as {errors: typeof baseErrors}).errors = [];
      const invalidData = {};

      const error = new HttpError('Validation Error', 400, {
        errors: [],
      });

      try {
        SchemasValidatorUtility.schemasValidation(schema, invalidData);
        throw (new Error('This should not be called'));
      } catch (e) {
        expect((e as HttpError).statusCode).toEqual(error.statusCode);
        expect((e as HttpError).message).toEqual(error.message);
        expect((e as HttpError).meta).toEqual(error.meta);
      }
    });
  });
});
