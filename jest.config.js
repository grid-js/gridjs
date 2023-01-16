const exps = require('./package.json').exports;
const roots = Object.entries(exps)
  .map((x) => !/legacy|package\.json|^\.\/$/gi.test(x[0]) ? x[0] : null)
  .filter(x => x);

module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ["jest-extended/all"],
  roots: roots,
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      ...require('./tsconfig.test.json')
    }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFiles: ['./tests/jest/setup.ts'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test))\\.(ts|js)x?$',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.{ts,tsx,js,jsx}',
    '!src/**/*.d.ts',
    '!src/**/*.test.ts',
  ],
};
