import type { Config } from 'jest';

const sharedConfig: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testEnvironment: 'node',
  transform: {
    '^.+\\.(t|j)s$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.spec.json',
      },
    ],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: ['src/**/*.ts'],
  coverageDirectory: 'coverage',
  clearMocks: true,
  restoreMocks: true,
  passWithNoTests: false,
};

const config: Config = {
  ...sharedConfig,
  projects: [
    {
      ...sharedConfig,
      displayName: 'unit',
      testMatch: ['<rootDir>/test/unit/**/*.spec.ts'],
    },
    {
      ...sharedConfig,
      displayName: 'integration',
      testMatch: ['<rootDir>/test/integration/**/*.spec.ts'],
    },
    {
      ...sharedConfig,
      displayName: 'e2e',
      testMatch: ['<rootDir>/test/e2e/**/*.e2e-spec.ts'],
    },
    {
      ...sharedConfig,
      displayName: 'regression',
      testMatch: ['<rootDir>/test/regression/**/*.spec.ts'],
    },
  ],
};

export default config;
