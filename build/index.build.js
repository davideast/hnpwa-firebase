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
const uglify = require("uglify-js");
const htmlmin = require("html-minifier");
const utils = require("../functions/utils");
/**
 * Compress any common JavaScript on the index.html page, and
 * compress the HTML.
 */
const minify = htmlmin.minify;
function compress() {
    return __awaiter(this, void 0, void 0, function* () {
        const indexTemplate = yield utils.readFile(process.cwd() + '/build/index.html');
        const swregTemplate = yield utils.readFile(process.cwd() + '/src/sw.reg.js');
        const swrefMin = uglify.minify(swregTemplate).code;
        const indexMin = minify(indexTemplate, {
            minifyJS: true,
            collapseWhitespace: true,
            removeAttributeQuotes: true
        });
        return Promise.all([
            utils.writeFile('./functions/index.html', indexMin),
            utils.writeFile('./public/sw.reg.js', swrefMin)
        ]);
    });
}
compress().then(() => console.log('Created /functions/index.html, /public/sw.reg.js'));
