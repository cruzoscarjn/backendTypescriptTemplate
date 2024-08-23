import Registry from './ImplementationRegistry';

jest.unmock('./ImplementationRegistry');

describe('ImplementationRegistry', () => {
  it('should contain only the expected keys', () => {
    const expectedKeys = ['UserRepository', 'AuthService'];
    const registryKeys = Object.keys(Registry);

    // Check if all expected keys are present
    expectedKeys.forEach((key) => {
      expect(registryKeys).toContain(key);
    });

    // Check if there are no unexpected keys
    expect(registryKeys.length).toBe(expectedKeys.length);
  });
});
