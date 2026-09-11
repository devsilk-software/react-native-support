/**
 * Tests run under plain Node with ts-jest. The core layer has no React or
 * React Native imports by design, and the UI files covered here (copy and
 * error classification) are equally plain, so neither needs the RN preset.
 * Component render tests would.
 */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src/core', '<rootDir>/src/ui'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: { verbatimModuleSyntax: false } }],
  },
};
