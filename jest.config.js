module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // setupFilesAfterEnv: ['<rootDir>/test/integration/init.ts'],
  roots: ['./test']
  // testMatch: ['**/__tests__/**/*.+(ts|tsx)', '**/?(*.)+(spec|test).+(ts|tsx)'],
  // moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node']
};
