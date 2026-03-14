//
//  babel.config.js
//  
//
//  Created by Emmanuel Babalola on 3/8/26.
//
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: ["expo-router/babel"],
  };
};
