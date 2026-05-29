module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: [
    'index.js',
    '!node_modules/**',
  ],
  coverageThreshold: {
    global: {
      lines:     60,
      functions: 60,
      branches:  50,
    },
  },
  coverageReporters: ['text', 'lcov', 'html'],
};
