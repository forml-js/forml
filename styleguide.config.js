function section(name, subdirectory, sections = []) {
    return {
        name,
        components: [`src/components/${subdirectory}/*.js`],
        ignore: ['**/index.js'],
        sections,
    };
}
module.exports = {
    pagePerSection: true,
    sections: [
        section('Exports', ''),
        section('Control Components', 'mapper'),
        section('Decorators',
                'decorator',
                [
                    section('Barebones',
                            'decorator/barebones',
                            [
                                section('Input', 'decorator/barebones/input'),
                                section('Arrays', 'decorator/barebones/arrays'),
                                section('Tabs', 'decorator/barebones/tabs'),
                            ]),
                    section('MaterialUI',
                            'decorator/mui',
                            [
                                section('Input', 'decorator/mui/input'),
                                section('Arrays', 'decorator/mui/arrays'),
                                section('Tabs', 'decorator/mui/tabs'),
                            ]),
                ]),
    ]
};
