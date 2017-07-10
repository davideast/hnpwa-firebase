"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const embed = require("../functions/css/embedcss");
const workbox = require('workbox-build');
const PRECACHE_MATCHER = '/** ::MANIFEST:: **/';
const uglify = require("uglify-js");
const htmlmin = require("html-minifier");
const utils = require("../functions/utils");
const minify = htmlmin.minify;
/**
 * Generate precache entries for the ServiceWorker
 */
function generateEntries() {
    return workbox.getFileManifestEntries({
        globDirectory: './src',
        globPatterns: ['**\/*.{html,js,css,png,jpg,json}'],
        globIgnores: ['sw.main.js', '404.html', 'images/icons/**/*', 'index.html'],
    });
}
/**
 * Generate top level Service Worker given precache entries
 * @param entries
 */
function createMinifiedSW(entries) {
    return __awaiter(this, void 0, void 0, function* () {
        const swTemplate = yield utils.readFile(process.cwd() + '/build/sw.main.js');
        const replacedTemplate = swTemplate.replace(PRECACHE_MATCHER, JSON.stringify(entries));
        const data = uglify.minify(replacedTemplate).code;
        const path = process.cwd() + '/public/sw.main.js';
        return [{ data, path }];
    });
}
function createMinifiedSWRegistration() {
    return __awaiter(this, void 0, void 0, function* () {
        const swregTemplate = yield utils.readFile(process.cwd() + '/src/sw.reg.js');
        const data = uglify.minify(swregTemplate).code;
        const path = process.cwd() + '/public/sw.reg.js';
        return [{ data, path }];
    });
}
function createCompressedIndex() {
    return __awaiter(this, void 0, void 0, function* () {
        const indexTemplate = yield utils.readFile(process.cwd() + '/build/index.html');
        const data = minify(indexTemplate, {
            minifyJS: true,
            collapseWhitespace: true,
            removeAttributeQuotes: true
        });
        const path = process.cwd() + '/functions/index.html';
        return [{ data, path }];
    });
}
/**
 * Build Steps
 * (assume tsc has ran)
 * 1. Generate SW entries
 * 2. Generate SW from entries
 * 3. Minify SW
 * 4. Minify SW registration
 * 5. Minify index.html
 * 6. Generate CSS HTML tags, write to functions/css
 */
function build() {
    return __awaiter(this, void 0, void 0, function* () {
        const entries = yield generateEntries();
        const sw = yield createMinifiedSW(entries);
        const reg = yield createMinifiedSWRegistration();
        const index = yield createCompressedIndex();
        const css = yield embed.generateStyles();
        const all = sw.concat(reg, index, css);
        return all.map(file => {
            console.log(`Writing ${file.path}.`);
            return utils.writeFile(file.path, file.data);
        });
    });
}
try {
    build();
}
catch (e) {
    console.log(e);
}
