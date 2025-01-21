const { getDefaultConfig } = require('expo/metro-config');

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  config.resolver.assetExts = [...config.resolver.assetExts, 'png', 'jpg', 'jpeg']; // Assurez-vous que les extensions d'image sont incluses

  return config;
})();
