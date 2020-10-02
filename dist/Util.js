"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadFile = exports.getLang = exports.isString = void 0;
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const https = require("https");
const zlib_1 = require("zlib");
const stream_1 = require("stream");
const util_1 = require("util");
const fs_1 = require("fs");
const pipe = util_1.promisify(stream_1.pipeline);
function isString(...str) {
    for (let s of str) {
        if (typeof s !== "string" || s.length < 1) {
            return false;
        }
    }
    return true;
}
exports.isString = isString;
function getLang(lang) {
    const languages = fs_extra_1.readJsonSync(path_1.join(__dirname, "../langs.json"));
    let code = null;
    if (lang.length === 2) {
        code = languages.find(l => l.alpha2 === lang);
    }
    else if (lang.length === 3) {
        code = languages.find(l => l.alpha3 === lang);
    }
    return code;
}
exports.getLang = getLang;
function downloadFile(url, path, unzip = true) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            https.get(url, {
                headers: {
                    "User-Agent": "TemporaryUserAgent"
                }
            }, res => {
                if (res.statusCode === 200) {
                    let writeFile;
                    let fStream = fs_1.createWriteStream(path);
                    if (unzip) {
                        writeFile = pipe(res, zlib_1.createUnzip(), fStream);
                    }
                    writeFile
                        .then(() => resolve(res.headers))
                        .catch(e => reject(new Error(e.message)));
                }
                else {
                    reject(new Error(`${res.statusCode} ${res.statusMessage}`));
                }
            });
        });
    });
}
exports.downloadFile = downloadFile;
//# sourceMappingURL=Util.js.map