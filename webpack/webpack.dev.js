const webpackShellPluginNext = require('webpack-shell-plugin-next');
const nodeExternals = require('webpack-node-externals');
const path = require('path');

const PATHS = {
    root: path.resolve(__dirname, '..'),
    nodeModules: path.resolve(__dirname, '../node_modules'),
    src: path.resolve(__dirname, '../src'),
    build: path.resolve(__dirname, '../build'),
    dist: path.resolve(__dirname, '../dist'),
};

module.exports = (env = {}) => {
    return {
        mode: 'production',
        target: 'web',
        entry: './app.ts',
        devtool: 'source-map',
        output: {
            filename: '[name].js',
            publicPath: '/',
            path: PATHS.dist,
            globalObject: 'this',
        },
        module: {
            rules: [
                {
                    test: /\.(ts|tsx)$/,
                    exclude: '/node_modules/',
                    use: [{
                        loader: 'ts-loader',
                    }, {
                        loader: 'file-replace-loader',
                        options: {
                            condition: 'always', // <-- Note that the rule applies for all files!
                            replacement(resourcePath) {
                                if (resourcePath.endsWith('environment.ts')) {
                                    return path.resolve(__dirname, '../environments/environment.prod.ts');
                                }
                            },
                            async: true,
                        },
                    }],
                },
            ],
        },
        plugins: [
            new webpackShellPluginNext({
                onBuildEnd: {
                    scripts: ['yarn run:dev']
                }
            })
        ],
        optimization: {
            minimize: true,
            runtimeChunk: 'single',
            splitChunks: {
                cacheGroups: {
                    vendor: {
                        chunks: 'initial',
                        test: path.resolve(__dirname, '../node_modules'),
                        name: 'vendor',
                        enforce: true,
                    },
                },
            },
        },
        externals: [ nodeExternals() ],
        resolve: {
            alias: PATHS,
            extensions: [ '.ts', '.tsx' ],
        },
    };
};
