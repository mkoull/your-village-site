const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");
const config = getDefaultConfig(__dirname);
// Read canonical service content and pure domain rules from the website.
config.watchFolders = [path.resolve(__dirname, "..")];
config.resolver.nodeModulesPaths = [path.resolve(__dirname, "node_modules")];
config.resolver.blockList = [/[/\\]\.next[/\\]/];
// SDK 57 imports query-string as a namespace. The patched v9 package exports
// a default object; this adapter preserves both forms without editing vendor code.
const queryAdapter = path.resolve(__dirname, "src/platform/query-string.ts");
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (
    moduleName === "query-string" &&
    context.originModulePath !== queryAdapter
  ) {
    return { type: "sourceFile", filePath: queryAdapter };
  }
  return context.resolveRequest(context, moduleName, platform);
};
module.exports = config;
