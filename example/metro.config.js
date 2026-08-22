const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/**
 * The example depends on the LOCAL SDK, not a published version:
 * package.json declares `react-native-support: file:..` and this config makes
 * Metro honor that — watching the repo root and resolving the package straight
 * to ../src, so edits to SDK source reload the app live with no rebuild step.
 */
const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '..');

const config = getDefaultConfig(projectRoot);

config.watchFolders = [workspaceRoot];

// Example's node_modules first, repo root's second (for the SDK's own deps).
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// Resolve ONLY react-native-support to its TypeScript source. Everything else
// resolves normally — a global 'source' condition would drag every package
// (expo included) to unbuilt source.
const SDK = 'react-native-support';
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === SDK) {
    return { type: 'sourceFile', filePath: path.join(workspaceRoot, 'src', 'index.ts') };
  }
  if (moduleName === `${SDK}/headless`) {
    return { type: 'sourceFile', filePath: path.join(workspaceRoot, 'src', 'headless.ts') };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
