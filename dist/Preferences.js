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
const platform_folders_1 = require("platform-folders");
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
exports.PREF_DIR = path_1.join(platform_folders_1.getDataHome(), "Subtitles CLI");
const PREF_FILE = path_1.join(exports.PREF_DIR, "preferences.json");
class Preferences {
    loadPreferences() {
        return __awaiter(this, void 0, void 0, function* () {
            yield fs_extra_1.ensureFile(PREF_FILE);
            try {
                const pref = yield fs_extra_1.readJson(PREF_FILE);
                this._lang = pref.lang;
                this._account = pref.account;
                this._useragent = pref.useragent;
            }
            catch (e) {
                this.writeFile();
            }
        });
    }
    writeFile() {
        fs_extra_1.writeJsonSync(PREF_FILE, {
            lang: this._lang,
            account: this._account,
            useragent: this._useragent
        });
    }
    get lang() {
        return this._lang;
    }
    get account() {
        return this._account;
    }
    get useragent() {
        return this._account;
    }
    set lang(value) {
        this._lang = value;
        this.writeFile();
    }
    set account(value) {
        this._account = value;
        this.writeFile();
    }
    set useragent(value) {
        this._useragent = value;
        this.writeFile();
    }
}
exports.default = new Preferences();
//# sourceMappingURL=Preferences.js.map