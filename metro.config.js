const { getDefaultConfig } = require('expo/metro-config');
const { plugins } = require('./babel.config');

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  config.resolver.assetExts = [...config.resolver.assetExts, 'png', 'jpg', 'jpeg'];
  return config;
})();
