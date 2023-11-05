module.exports = function (api) {
    api.cache(true);
    return {
        sourceMaps: api.env('production') ? false : 'both',
        presets: [
            [
                '@babel/preset-env',
                { targets: { browsers: ['last 2 Chrome versions'] } },
            ],
            '@babel/preset-react',
        ],
        plugins: [
            '@babel/plugin-proposal-object-rest-spread',
            '@babel/plugin-proposal-nullish-coalescing-operator',
        ],
    };
};
