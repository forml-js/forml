module.exports = function (api) {
    console.log('babel.config.js');
    api.cache(true);
    return {
        exclude: ['node_modules'],
        presets: [
            [
                '@babel/preset-env',
                {
                    targets: { browsers: ['last 2 Chrome versions'] },
                },
            ],
            ['@babel/preset-react', { runtime: 'automatic' }],
        ],
    };
};
