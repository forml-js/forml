module.exports = function (api) {
    console.log('babel.config.js');
    return {
        sourceMaps: api.env('production') ? false : 'both',
        presets: [
            [
                '@babel/preset-env',
                {
                    targets: { browsers: ['last 2 Chrome versions'] },
                },
            ],
            '@babel/preset-react',
        ],
        plugins: ['@babel/plugin-transform-runtime'],
    };
};
