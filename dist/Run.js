#!/usr/bin/env node
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
const path_1 = require("path");
const fs_extra_1 = require("fs-extra");
const ArgPars_1 = require("./ArgPars");
const chalk = require("chalk");
const Preferences_1 = require("./Preferences");
const Authentication_1 = require("./Authentication");
const Util_1 = require("./Util");
const DownloadEventHandler_1 = require("./DownloadEventHandler");
const os_1 = require("os");
const args = ArgPars_1.default();
let osub;
let quota = -Infinity;
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        const targetPath = getPath();
        const files = getFiles(targetPath);
        if (files.length < 1) {
            console.log(chalk.yellowBright(`${os_1.EOL}No files found${os_1.EOL}`));
            return;
        }
        yield Preferences_1.default.loadPreferences();
        const lang = getLanguage();
        // await downloadFile(
        // 	"https://dl.opensubtitles.org/en/download/src-api/vrf-19cc0c5d/sid-5db4NRRCgE4S2f0cf7hygCtGqTf/file/1953905758.gz",
        // 	// "https://img.freepik.com/free-vector/abstract-technology-particle-background_52683-25766i.jpg?size=626&ext=jpg",
        // 	"/Users/andu/Downloads/sub.srt",
        // 	true,
        // );
        osub = yield Authentication_1.default();
        const downloadWatcher = new DownloadEventHandler_1.default(files.length);
        for (let file of files) {
            downloadSubtitle(file, lang)
                .then(downloadWatcher.successHandler)
                .catch(downloadWatcher.errorHandler);
        }
        const result = yield downloadWatcher.finishAll();
        printResult(result);
        if (quota > -1) {
            console.log(chalk.yellowBright(`${os_1.EOL}OpenSubtitle.org download quota: ${chalk.bold(quota)}`));
        }
        // const subs=await (await authenticate()).search({
        // 	sublanguageid:"eng",
        // 	path:"/Users/andu/Downloads/Breaking.Bad.S05.1080p.BluRay.x264-ROVERS/breaking.bad.s05e11.1080p.bluray.x264-rovers.mkv",
        // 	filename:"breaking.bad.s05e11.1080p.bluray.x264-rovers.mkv",
        // 	gzip:true,
        // });
        //
        // console.log(subs);
    });
}
function printResult(result) {
    if (result.success.length > 0) {
        console.log();
        console.log(chalk.bold.green("  SUCCESS:"));
        for (let fileName of result.success) {
            console.log(chalk.green("✔ ") + chalk.greenBright(`${fileName}`));
        }
    }
    if (result.err.length > 0) {
        console.log();
        console.log(chalk.bold.red("  ERRORS:"));
        for (let error of result.err) {
            console.log(chalk.red("✖ ") + chalk.redBright(`${error.fileName} ${chalk.red(error.message)}`));
        }
    }
}
function downloadSubtitle(file, lang) {
    return __awaiter(this, void 0, void 0, function* () {
        const fileBaseName = path_1.basename(file);
        const subs = yield searchSubtitles(file, lang);
        if (subs.length < 1) {
            throw new DownloadEventHandler_1.DownloadError("No subtitles found", fileBaseName);
        }
        try {
            const headers = yield Util_1.downloadFile(subs[0].url, file.replace(/\.[^.]*$/, `.${subs[0].format}`), true);
            const dowQuota = Number.parseInt(headers["download-quota"]);
            if (!Number.isNaN(dowQuota)) {
                quota = dowQuota;
            }
        }
        catch (e) {
            throw new DownloadEventHandler_1.DownloadError(e.message, fileBaseName);
        }
        return fileBaseName;
    });
}
function searchSubtitles(videoFile, lang) {
    return __awaiter(this, void 0, void 0, function* () {
        const subsFound = yield osub.search({
            sublanguageid: lang.alpha3,
            path: videoFile,
            filename: path_1.basename(videoFile),
            gzip: true,
        });
        return Object.values(subsFound).filter(s => s.langcode === lang.alpha2);
    });
}
function getLanguage() {
    var _a, _b;
    const lang = Util_1.getLang((_b = (_a = args.lang) !== null && _a !== void 0 ? _a : Preferences_1.default.lang) !== null && _b !== void 0 ? _b : "eng");
    if (lang !== null) {
        const isDefault = (lang.alpha3 !== Preferences_1.default.lang && !args.saveLang);
        console.log(chalk.greenBright(`Language set to ${chalk.yellow(lang.name)}` +
            (isDefault ? `. To save as default add ${chalk.blueBright("-s")} option` : " as default") +
            os_1.EOL));
        if (args.saveLang === true) {
            Preferences_1.default.lang = lang.alpha3;
        }
        return lang;
    }
    else {
        console.error(chalk.redBright(`No language found for code ${chalk.red(args.lang)}`));
        process.exit(0);
    }
}
function getPath() {
    let targetPath;
    if (!Util_1.isString(args.path)) {
        console.error(chalk.redBright.bold(`No path specified!${os_1.EOL}`));
        console.log(args.parser.helpInformation());
        process.exit(0);
    }
    if (path_1.isAbsolute(args.path)) {
        targetPath = args.path;
    }
    else {
        targetPath = path_1.join(process.cwd(), args.path);
    }
    if (!fs_extra_1.pathExistsSync(targetPath)) {
        console.error(chalk.redBright(`Path '${chalk.bold.red(targetPath)}' doesn't exist`));
        process.exit(0);
    }
    return targetPath;
}
function getFiles(targetPath) {
    let files = null;
    const lstatRes = fs_extra_1.lstatSync(targetPath);
    if (lstatRes.isFile() && isVideoFile(targetPath)) {
        files = [targetPath];
    }
    else if (lstatRes.isDirectory()) {
        files = fs_extra_1.readdirSync(targetPath)
            .filter(isVideoFile)
            .map(fn => path_1.join(targetPath, fn));
        if (args.overwrite === false) {
            files = files.filter(path => !fs_extra_1.pathExistsSync(path.replace(/\.[^.]*$/, ".srt")));
        }
    }
    return files;
}
function isVideoFile(path) {
    var _a;
    const ext = (_a = path.split(".").pop()) !== null && _a !== void 0 ? _a : null;
    return extensions.indexOf(ext) > -1;
}
const extensions = JSON.parse(fs_extra_1.readFileSync(path_1.join(__dirname, "../extensions.json"), { encoding: "utf8" }));
start().catch(e => console.error(e));
//# sourceMappingURL=Run.js.map