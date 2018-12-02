const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  chainWebpack: (config) =>  {
    config
      .plugin('palantir-config')
      .use(CopyWebpackPlugin, [[{
        from: path.resolve(__dirname, 'palantir.json'),
        to: path.resolve(__dirname, 'dist/palantir.json'),
        toType: 'file',
      }]]);
  },
};
