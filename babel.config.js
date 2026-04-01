module.exports = function (api) {
    console.log('babel.config.js');
    api.cache(true);
    return {
        exclude: ['node_modules'],
        sourceMaps: 'both',
        presets: [
            [
                '@babel/preset-env',
                {
                    targets: {
                        esmodules: true,
                        browsers: ['last 2 Chrome versions'],
                    },
                },
            ],
            ['@babel/preset-react', { runtime: 'automatic' }],
        ],
    };
};
