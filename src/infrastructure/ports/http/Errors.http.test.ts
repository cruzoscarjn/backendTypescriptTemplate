import ErrorsHttp, { Meta } from '#infrastructure/ports/http/Errors.http';

jest.unmock('#infrastructure/ports/http/Errors.http');

describe('ErrorsHttp', () => {
  describe('HttpError', () => {
    it('should create an instance of HttpError', () => {
      const message = 'Test error message';
      const statusCode = 500;
      const meta: Meta = { errors: [] };

      const error = new ErrorsHttp.HttpError(message, statusCode, meta);

      expect(error).toBeInstanceOf(ErrorsHttp.HttpError);
      expect(error.message).toBe(message);
      expect(error.statusCode).toBe(statusCode);
      expect(error.meta).toBe(meta);
    });

    it('should create an instance of HttpError with default values', () => {
      const message = 'Test error message';
      const statusCode = 500;
      const meta: Meta = {};

      const error = new ErrorsHttp.HttpError(message);

      expect(error).toBeInstanceOf(ErrorsHttp.HttpError);
      expect(error.message).toBe(message);
      expect(error.statusCode).toBe(statusCode);
      expect(error.meta).toStrictEqual(meta);
    });
  });

  describe('Internal', () => {
    it('should create an instance of Internal', () => {
      const message = 'Test error message';
      const statusCode = 500;
      const meta: Meta = { errors: [] };

      const error = new ErrorsHttp.Internal(message, statusCode, meta);

      expect(error).toBeInstanceOf(ErrorsHttp.Internal);
      expect(error).toBeInstanceOf(ErrorsHttp.HttpError);
      expect(error.message).toBe(message);
      expect(error.statusCode).toBe(statusCode);
      expect(error.meta).toBe(meta);
    });

    it('should create an instance of Internal with default values', () => {
      const message = 'Internal server error';
      const statusCode = 500;
      const meta: Meta = {};

      const error = new ErrorsHttp.Internal();

      expect(error).toBeInstanceOf(ErrorsHttp.Internal);
      expect(error).toBeInstanceOf(ErrorsHttp.HttpError);
      expect(error.message).toBe(message);
      expect(error.statusCode).toBe(statusCode);
      expect(error.meta).toStrictEqual(meta);
    });
  });

  describe('Unauthorized', () => {
    it('should create an instance of Unauthorized', () => {
      const message = 'Test error message';
      const meta: Meta = { errors: [] };

      const error = new ErrorsHttp.Unauthorized(message, meta);

      expect(error).toBeInstanceOf(ErrorsHttp.Unauthorized);
      expect(error).toBeInstanceOf(ErrorsHttp.Internal);
      expect(error).toBeInstanceOf(ErrorsHttp.HttpError);
      expect(error.message).toBe(message);
      expect(error.statusCode).toBe(401);
      expect(error.meta).toBe(meta);
    });
  });

  describe('NotFound', () => {
    it('should create an instance of NotFound', () => {
      const message = 'Test error message';
      const meta: Meta = { errors: [] };

      const error = new ErrorsHttp.NotFound(message, meta);

      expect(error).toBeInstanceOf(ErrorsHttp.NotFound);
      expect(error).toBeInstanceOf(ErrorsHttp.Internal);
      expect(error).toBeInstanceOf(ErrorsHttp.HttpError);
      expect(error.message).toBe(message);
      expect(error.statusCode).toBe(404);
      expect(error.meta).toBe(meta);
    });

    it('should create an instance of NotFound with default values', () => {
      const message = 'Not found';
      const meta: Meta = {};

      const error = new ErrorsHttp.NotFound();

      expect(error).toBeInstanceOf(ErrorsHttp.NotFound);
      expect(error).toBeInstanceOf(ErrorsHttp.Internal);
      expect(error).toBeInstanceOf(ErrorsHttp.HttpError);
      expect(error.message).toBe(message);
      expect(error.statusCode).toBe(404);
      expect(error.meta).toStrictEqual(meta);
    });
  });

  describe('Forbidden', () => {
    it('should create an instance of Forbidden', () => {
      const message = 'Test error message';
      const meta: Meta = { errors: [] };

      const error = new ErrorsHttp.Forbidden(message, meta);

      expect(error).toBeInstanceOf(ErrorsHttp.Forbidden);
      expect(error).toBeInstanceOf(ErrorsHttp.Internal);
      expect(error).toBeInstanceOf(ErrorsHttp.HttpError);
      expect(error.message).toBe(message);
      expect(error.statusCode).toBe(403);
      expect(error.meta).toBe(meta);
    });

    it('should create an instance of Forbidden with default values', () => {
      const message = 'Forbidden';
      const meta: Meta = {};

      const error = new ErrorsHttp.Forbidden();

      expect(error).toBeInstanceOf(ErrorsHttp.Forbidden);
      expect(error).toBeInstanceOf(ErrorsHttp.Internal);
      expect(error).toBeInstanceOf(ErrorsHttp.HttpError);
      expect(error.message).toBe(message);
      expect(error.statusCode).toBe(403);
      expect(error.meta).toStrictEqual(meta);
    });
  });

  describe('Conflict', () => {
    it('should create an instance of Conflict', () => {
      const message = 'Test error message';
      const meta: Meta = { errors: [] };

      const error = new ErrorsHttp.Conflict(message, meta);

      expect(error).toBeInstanceOf(ErrorsHttp.Conflict);
      expect(error).toBeInstanceOf(ErrorsHttp.Internal);
      expect(error).toBeInstanceOf(ErrorsHttp.HttpError);
      expect(error.message).toBe(message);
      expect(error.statusCode).toBe(409);
      expect(error.meta).toBe(meta);
    });

    it('should create an instance of Conflict with default values', () => {
      const message = 'Conflict';
      const meta: Meta = {};

      const error = new ErrorsHttp.Conflict();

      expect(error).toBeInstanceOf(ErrorsHttp.Conflict);
      expect(error).toBeInstanceOf(ErrorsHttp.Internal);
      expect(error).toBeInstanceOf(ErrorsHttp.HttpError);
      expect(error.message).toBe(message);
      expect(error.statusCode).toBe(409);
      expect(error.meta).toStrictEqual(meta);
    });
  });

  describe('BadRequest', () => {
    it('should create an instance of BadRequest', () => {
      const message = 'Test error message';
      const meta: Meta = { errors: [] };

      const error = new ErrorsHttp.BadRequest(message, meta);

      expect(error).toBeInstanceOf(ErrorsHttp.BadRequest);
      expect(error).toBeInstanceOf(ErrorsHttp.Internal);
      expect(error).toBeInstanceOf(ErrorsHttp.HttpError);
      expect(error.message).toBe(message);
      expect(error.statusCode).toBe(400);
      expect(error.meta).toBe(meta);
    });

    it('should create an instance of BadRequest with default values', () => {
      const message = 'Bad request';
      const meta: Meta = {};

      const error = new ErrorsHttp.BadRequest();

      expect(error).toBeInstanceOf(ErrorsHttp.BadRequest);
      expect(error).toBeInstanceOf(ErrorsHttp.Internal);
      expect(error).toBeInstanceOf(ErrorsHttp.HttpError);
      expect(error.message).toBe(message);
      expect(error.statusCode).toBe(400);
      expect(error.meta).toStrictEqual(meta);
    });
  });
});
