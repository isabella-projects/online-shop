const path = require('path');

function getViewsPath(viewEngine) {
    switch (viewEngine) {
        case 'pug':
            return 'views/pug';
        case 'ejs':
            return 'views/ejs';
        default:
            throw new Error(`Unsupported view engine: ${viewEngine}`);
    }
}

function getSequelizeMethods(model) {
    for (let assoc of Object.keys(model.associations)) {
        for (let accessor of Object.keys(model.associations[assoc].accessors)) {
            console.log(model.name + '.' + model.associations[assoc].accessors[accessor] + '()');
        }
    }
}

const rootDir = path.dirname(require.main.filename);

module.exports = {
    getViewsPath,
    getSequelizeMethods,
    rootDir,
};
