const { withAppBuildGradle } = require('@expo/config-plugins');

module.exports = function withAndroidAbiFilters(config) {
  return withAppBuildGradle(config, config => {
    if (config.modResults.contents.includes('abiFilters')) {
      return config;
    }
    
    // Inject the abiFilters into the defaultConfig block
    config.modResults.contents = config.modResults.contents.replace(
      /defaultConfig\s*\{/,
      `defaultConfig {\n        ndk {\n            abiFilters "armeabi-v7a", "arm64-v8a"\n        }`
    );
    return config;
  });
};
