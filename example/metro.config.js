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

// Fallback lookup for the SDK's own runtime deps (styled-components) that npm
// may not have placed in the example's tree.
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// The repo root's node_modules holds the SDK's DEV copies of react and
// react-native (different versions than Expo Go ships). Files under ../src
// must never resolve those — blocking them forces the fallback above to the
// example's copies, keeping exactly one React in the bundle. The trailing
// slash keeps react-native-support itself resolvable.
const block = (name) =>
  `${workspaceRoot.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/node_modules/${name}/.*`;
const defaults = config.resolver.blockList;
const defaultSources = (Array.isArray(defaults) ? defaults : [defaults])
  .filter(Boolean)
  .map((re) => re.source);
config.resolver.blockList = new RegExp(
  [...defaultSources, block('react'), block('react-native'), block('react-dom')]
    .map((s) => `(${s})`)
    .join('|'),
);

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
