const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/**
 * The example depends on the LOCAL SDK, not a published version:
 * package.json declares `react-native-support: file:..` and this config makes
 * Metro actually honor that — watching the repo root and resolving the
 * package's `source` condition, so edits under ../src reload the app live
 * with no rebuild step.
 */
const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '..');

const config = getDefaultConfig(projectRoot);

config.watchFolders = [workspaceRoot];

config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// Prefer the package's `source` export (src/index.ts) over built output.
config.resolver.unstable_conditionNames = ['source', 'react-native', 'require', 'import'];

// One copy of react/react-native/styled-components: always the example's.
config.resolver.disableHierarchicalLookup = true;

module.exports = config;
