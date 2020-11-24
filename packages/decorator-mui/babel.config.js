module.exports = function (api) {
    api.cache(true);
    return {
        presets: [
            [
                '@babel/preset-env',
                { targets: { browsers: ['last 2 Chrome versions'] } },
            ],
            '@babel/preset-react',
        ],
        plugins: ['@babel/plugin-proposal-object-rest-spread'],
    };
};
