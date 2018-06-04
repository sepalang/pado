const path = require('path');
const configAlias = require('./config.alias.js').module(path.resolve(__dirname,"../"));

module.exports = (storybookBaseConfig, configType, defaultConfig) => {
  
  storybookBaseConfig.resolve.alias = Object.assign(
    {},
    storybookBaseConfig.resolve.alias,
    configAlias
  );
  
  defaultConfig.resolve.alias = Object.assign(
    {},
    defaultConfig.resolve.alias,
    configAlias
  );
  
  return defaultConfig;
};
