/**
 * Core-layer tests run under plain Node with ts-jest — the core has no React
 * or React Native imports by design (plan §3), which is what makes this work.
 * UI component tests (RN preset) arrive with the M1 keyboard/render spikes.
 */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src/core'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: { verbatimModuleSyntax: false } }],
  },
};
