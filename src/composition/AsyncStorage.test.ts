import { AsyncLocalStorage } from 'async_hooks';

import AsyncStorage from './AsyncStorage';

jest.unmock('./AsyncStorage');

describe('AsyncStorage', () => {
  it('should be an instance of AsyncLocalStorage', () => {
    expect(AsyncStorage).toBeInstanceOf(AsyncLocalStorage);
  });

  it('should run a function with a specific context and retrieve the same context', (done) => {
    const testContext = { id: 'testId' };

    AsyncStorage.run(testContext, () => {
      const store = AsyncStorage.getStore();
      expect(store).toEqual(testContext);
      done();
    });
  });
});
