module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: 'src',
    testRegex: '.*\\.spec\\.ts$',
    transform: {
      '^.+\\.(t|j)s$': 'ts-jest',
    },
    coverageDirectory: '../coverage',
    testPathIgnorePatterns: ['/node_modules/'],
    moduleNameMapper: {
      '^src/(.*)$': '<rootDir>/$1', // This maps 'src/' to the root directory.
    },
  };
  