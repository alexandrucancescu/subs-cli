"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander = require("commander");
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const os_1 = require("os");
function parse() {
    var _a, _b, _c, _d;
    const pack = fs_extra_1.readJsonSync(path_1.join(__dirname, "../package.json"));
    const program = new commander.Command("subs");
    program.version(pack.version);
    program.option("-l, --lang <value>", "the language of the subtitles (eng/en, fr/fre, ro/rum, ...) (default: eng)");
    // program.option("-u, --username <value>","username on opensubtitles.org");
    // program.option("-p, --password <value>","password on opensubtitles.org");
    program.option("-o, --overwrite", "overwrite existing subtitles", false);
    program.option("-p, --path", "path of file or dir of files to download subtitles for");
    program.option("-s, --save-lang", "save the current language as default");
    program.option("-N, --no-prompt", "the app will not prompt for any user input");
    if (os_1.platform() === "darwin") {
        program.option("-n, --notification-output", "show output as a notification");
    }
    program.usage("<path> [options]");
    program.parse(process.argv);
    // console.log(program.opts())
    return {
        lang: program.lang,
        username: program.username,
        password: program.password,
        overwrite: (_a = program.overwrite) !== null && _a !== void 0 ? _a : false,
        saveLang: (_b = program.saveLang) !== null && _b !== void 0 ? _b : false,
        path: program.args[0],
        parser: program,
        notificationOutput: (_c = program.notificationOutput) !== null && _c !== void 0 ? _c : false,
        noPrompt: (_d = program.noPrompt) !== null && _d !== void 0 ? _d : false,
    };
}
exports.default = parse;
//# sourceMappingURL=ArgPars.js.map