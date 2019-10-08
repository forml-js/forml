module.exports = function(api) {
    api.cache(true);
    return {
        'presets': [['@babel/preset-env', {'targets': {'browsers': ['last 2 Chrome versions']}}]],
        'plugins':
            ['@babel/plugin-proposal-object-rest-spread', '@babel/plugin-proposal-class-properties']
    };
}

