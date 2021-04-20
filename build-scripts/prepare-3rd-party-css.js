const fs = require('fs')
const postcss = require('postcss')
const prefixWrap = require('postcss-prefixwrap');

/**
 * This script creates a single app.js file to make it easier to embed into other web applications. It also copies the
 * stylesheet to app-styles.css, so there's a version without the hash in the name.
 */

// TODO: Change this value so it's unique from other projects that may be embedded within the same parent web application:
const STYLES_ROOT_SELECTOR = '.my-styles-root';

/**
 * Combs through the 3rd party CSS file, and wraps each selector underneath STYLES_ROOT_SELECTOR, so it is encapsulated
 * when used with within another web application.
 */
function processCssFile(src, dest) {
    fs.readFile(src, (err, css) => {
        postcss([
            prefixWrap(STYLES_ROOT_SELECTOR, {
                // Some selectors need to be preserved, since they get used at the root of the DOM (they get attached to the body)
                ignoredSelectors: ['.modal', '.fade']
            })
        ]).process(css, {from: src, to: dest}).then(result => {
            fs.writeFile(dest, result.css, () => true);
        });
    })
}

processCssFile('node_modules/bootstrap/dist/css/bootstrap.css', 'node_modules/bootstrap/dist/css/bootstrap-modified.css');
processCssFile('node_modules/@ux-aspects/ux-aspects/styles/ux-aspects.css', 'node_modules/@ux-aspects/ux-aspects/styles/ux-aspects-modified.css');
