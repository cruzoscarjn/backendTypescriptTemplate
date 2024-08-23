import asyncHooksModule from 'async_hooks';

const asyncHooks = jest.createMockFromModule<jest.Mocked<typeof asyncHooksModule>>('async_hooks');

const mockAsyncStorage = new asyncHooks.AsyncLocalStorage();

export default mockAsyncStorage;
