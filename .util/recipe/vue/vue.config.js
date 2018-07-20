const path = require('path');

module.exports = {
  configureWebpack: config=>{
    config.resolve.alias['@sepalang/pado'] = path.join(__dirname, "../../..");

    config.module.rules[0].use[1].options.compilerOptions = {
      preserveWhitespace: true
    };
    
    // throw new Error("force stop");
  }
};
