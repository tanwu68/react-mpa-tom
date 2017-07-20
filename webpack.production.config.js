const path = require('path');
const glob = require('glob');//glob 模块：遍历出src/script目录下的所有js文件
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const pkg = require('./package.json');
const jsDir = path.resolve(__dirname, 'app/views');

//MPA
const entries = () => {
  let entryFiles = glob.sync(jsDir + '/**/*.{js,jsx}');
  let fileMap = {};

  for (let i = 0; i < entryFiles.length; i++) {
    let filePath = entryFiles[i];
    let filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'));
    fileMap[filename] = filePath;
  }
  return fileMap;
};

const html_plugins = () => {
   let entryHtml = glob.sync(jsDir + '/**/*.html');
   let mpaHtml = [];
   for (let i = 0; i < entryHtml.length; i++) {
       let filePathHtml = entryHtml[i];
       let filenameHtml = filePathHtml.substring(filePathHtml.lastIndexOf('\/') + 1, filePathHtml.lastIndexOf('.'));
       let conf = {
           title: filenameHtml,
           template: filePathHtml,
           filename: filenameHtml + '.html',
           chunks: ['vendor', filenameHtml],
           inject: 'body'
       };
       mpaHtml.push(new HtmlWebpackPlugin(conf));
    }

   return mpaHtml
};

const TWPlugins = [];
TWPlugins.push(
    // webpack 内置的 banner-plugin
    new webpack.BannerPlugin("Copyright by tanwu68@github.com."),

    // 定义为生产环境，编译 React 时压缩到最小
    new webpack.DefinePlugin({
      'process.env':{
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      }
    }),

    // 为组件分配ID，通过这个插件webpack可以分析和优先考虑使用最多的模块，并为它们分配最小的ID
    new webpack.optimize.OccurenceOrderPlugin(),

    new webpack.optimize.UglifyJsPlugin({
      compress: {
        //supresses warnings, usually from module minification
        warnings: false
      }
    }),

    // 分离CSS和JS文件
    new ExtractTextPlugin('css/[name].[chunkhash:8].css'),

    // 提供公共代码
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'js/[name].[chunkhash:8].js'
    }),

    // 可在业务 js 代码中使用 __DEV__ 判断是否是dev模式（dev模式下可以提示错误、测试报告等, production模式不提示）
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(JSON.parse((process.env.NODE_ENV == 'dev') || 'false'))
    })
);

module.exports = {
  entry: Object.assign(
      entries(),{
      // 将 第三方依赖 单独打包
      vendor: Object.keys(pkg.dependencies)
  }),
  output: {
      publicPath: '/',
      path: __dirname + "/build",
      filename: "js/[name].[chunkhash:8].js"
  },

  resolve:{
      extensions:['', '.js','.jsx']
  },

  module: {
    loaders: [
        { test: /\.(js|jsx)$/, exclude: /node_modules/, loader: 'babel' },
        { test: /\.less$/, exclude: /node_modules/, loader: ExtractTextPlugin.extract('style', 'css!postcss!less') },
        { test: /\.css$/, exclude: /node_modules/, loader: ExtractTextPlugin.extract('style', 'css!postcss') },
        { test:/\.(png|gif|jpg|jpeg|bmp)$/i, loader:'url-loader?limit=5000&name=img/[name].[chunkhash:8].[ext]' },
        { test:/\.(png|woff|woff2|svg|ttf|eot)($|\?)/i, loader:'url-loader?limit=5000&name=fonts/[name].[chunkhash:8].[ext]'}
    ]
  },
  postcss: [
    require('autoprefixer')
  ],

  plugins: TWPlugins.concat(html_plugins())
};