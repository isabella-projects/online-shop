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

const rootDir = path.dirname(require.main.filename);

module.exports = {
    rootDir,
    getViewsPath,
};
