import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  rootDir: './',
  testRegex: '.*\\.test\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.ts'],
  coverageDirectory: './coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^#domain/(.*)$': '<rootDir>/src/domain/$1',
    '^#infrastructure/(.*)$': '<rootDir>/src/infrastructure/$1',
    '^#application/(.*)$': '<rootDir>/src/application/$1',
    '^#composition/(.*)$': '<rootDir>/src/composition/$1',
  },
  coveragePathIgnorePatterns: [
    '<rootDir>/dist/',
    '<rootDir>/.*\\.d\\.ts',
    '<rootDir>/\\.eslintrc\\.js',
    '<rootDir>/jest\\.config\\.ts',
    '<rootDir>/coverage/',
    '<rootDir>/.*\\.schema\\.ts',
    '<rootDir>/src/infrastructure/ports/swagger/',
    '<rootDir>/src/infrastructure/databases/core/migrations/',
    '<rootDir>/src/infrastructure/databases/core/knexfile.ts',
  ],
  automock: true,
  fakeTimers: {
    now: (new Date('2024-08-21T00:00:00Z')).getTime(),
    enableGlobally: true,
  },
  coverageThreshold: {
    global: {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95,
    },
  },
};

export default config;
