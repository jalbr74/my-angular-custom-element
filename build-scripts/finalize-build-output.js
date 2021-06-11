const replace = require('replace-in-file');
const globby = require('globby');
const fs = require('fs');

/**
 * This script creates a single app.js file to make it easier to embed into other web applications. It also copies the
 * stylesheet to app-styles.css, so there's a version without the hash in the name.
 */

// TODO: Change this value so it's unique from other projects that may be embedded within the same parent web application:
const NEW_JSONP_FUNCTION = 'myWebpackJsonp';

const angularJson = require('../angular.json');
const WORKING_DIR = angularJson.projects[angularJson.defaultProject].architect.build.options.outputPath;
const jsFiles = globby.sync(['main.*.js', 'polyfills.*.js', 'runtime.*.js', 'vendor.*.js'], { cwd: WORKING_DIR, absolute: true });
const cssFiles = globby.sync(['styles.*.css'], { cwd: WORKING_DIR, absolute: true });

replace.sync({ files: WORKING_DIR + '/*.js', from: /\bwebpackJsonp\b/g, to: NEW_JSONP_FUNCTION });

function concat(inputFiles, outputFile) {
    if (fs.existsSync(outputFile)) {
        fs.unlinkSync(outputFile);
    }

    inputFiles.forEach((inputFile) => {
        fs.appendFileSync(outputFile, fs.readFileSync(inputFile));
        fs.appendFileSync(outputFile, '\n\n');
    });
}

concat(jsFiles, WORKING_DIR + '/' + angularJson.defaultProject + '-all.js');
concat(cssFiles, WORKING_DIR + '/' + angularJson.defaultProject + '-all.css');
