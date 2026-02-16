/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  // 1. Use the ESM preset
  preset: 'ts-jest/presets/default-esm',

  testEnvironment: 'node',

  // 2. THIS IS CRITICAL: specificy .ts files as ESM
  extensionsToTreatAsEsm: ['.ts'],

  // 3. Map imports with '.js' extensions to the actual files
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },

  transform: {
    // 4. Use ts-jest with useESM enabled
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
};
