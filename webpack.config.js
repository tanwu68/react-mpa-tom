const path = require('path');
const glob = require('glob');//glob 模块：遍历出src/script目录下的所有js文件
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
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
            chunks: [filenameHtml],
            inject: 'body'
        };
        mpaHtml.push(new HtmlWebpackPlugin(conf));
    }

    return mpaHtml;
};

const TWPlugins = [];
TWPlugins.push(
    // 热加载插件
    new webpack.HotModuleReplacementPlugin(),

    // 打开浏览器
    new OpenBrowserPlugin({
        url: 'http://localhost:8080'
    }),

    // 可在业务 js 代码中使用 __DEV__ 判断是否是dev模式（dev模式下可以提示错误、测试报告等, production模式不提示）
    new webpack.DefinePlugin({
        __DEV__: JSON.stringify(JSON.parse((process.env.NODE_ENV == 'dev') || 'false'))
    })
);

module.exports = {
    entry: entries(),
    output: {
        publicPath: '/',
        path: __dirname + "/build",
        filename: "js/[name].js"
    },

    resolve:{
        extensions:['', '.js','.jsx']
    },

    module: {
        loaders: [
            { test: /\.(js|jsx)$/, exclude: /node_modules/, loader: 'babel' },
            { test: /\.less$/, exclude: /node_modules/, loader: 'style!css!postcss!less' },
            { test: /\.css$/, exclude: /node_modules/, loader: 'style!css!postcss' },
            { test:/\.(png|gif|jpg|jpeg|bmp)$/i, loader:'url-loader?limit=5000' },  // 限制大小5kb
            { test:/\.(png|woff|woff2|svg|ttf|eot)($|\?)/i, loader:'url-loader?limit=5000'} // 限制大小小于5k
        ]
    },

    eslint: {
        configFile: '.eslintrc' // Rules for eslint
    },

    postcss: [
        require('autoprefixer') //调用autoprefixer插件，例如 display: flex
    ],

    plugins: TWPlugins.concat(html_plugins()),

    devServer: {
        contentBase: "./public", //本地服务器所加载的页面所在的目录
        colors: true, //终端中输出结果为彩色
        inline: true, //实时刷新
        hot: true,  // 使用热加载插件 HotModuleReplacementPlugin
        proxy: {
            '/api1': {
                target: 'http://m.test.duocai100.com/',
                secure: false,
                pathRewrite: {'/api1' : '/'}
            },
            '/api2': {
                target: 'https://www.duocai100.com/',
                secure: false,
                pathRewrite: {'/api2' : '/'}
            }
        }

    }
};
