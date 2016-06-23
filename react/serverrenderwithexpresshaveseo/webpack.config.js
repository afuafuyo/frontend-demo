var path = require('path');

module.exports = {
    entry : [
        './app/client/index.js'
    ],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: '/static/'
    },
    module: {
        loaders: [{
            test: /\.js$/,
            loader: 'babel',
            exclude: /node_modules/,
            include: __dirname
        },
        { test: /\.(png|jpg|gif|jpeg)$/, loader: 'url-loader?limit=1024'},
        { test: /\.css$/, loader: 'style!css' }
    ]}
};