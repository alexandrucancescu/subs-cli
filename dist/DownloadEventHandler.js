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
const ora = require("ora");
const chalk = require("chalk");
class DownloadEventHandler {
    constructor(count) {
        this.errors = [];
        this.successFiles = [];
        this.count = count;
        this.newSpinner();
    }
    _onError(error) {
        this.errors.push(error);
        this.newEntry();
    }
    _onSuccess(fileName) {
        this.successFiles.push(fileName);
        this.newEntry();
    }
    newEntry() {
        this.updateSpinner();
        if (this.errors.length + this.successFiles.length === this.count) {
            this.stopSpinner();
            this.callback({
                err: this.errors,
                success: this.successFiles,
            });
        }
    }
    stopSpinner() {
        const func = this.errors.length > 0 ? (this.successFiles.length > 0 ? "warn" : "fail") : "succeed";
        this.spinner[func](chalk.yellowBright(`Done ${this.errors.length + this.successFiles.length}/${this.count} | ` +
            `${chalk.greenBright(`Success: ${this.successFiles.length}`)} | ` +
            `${chalk.redBright(`Error: ${this.errors.length}`)}`));
    }
    updateSpinner() {
        this.spinner.text = chalk.yellowBright(`Downloading ${this.errors.length + this.successFiles.length}/${this.count} | ` +
            `${chalk.greenBright(`Success: ${this.successFiles.length}`)} | ` +
            `${chalk.redBright(`Error: ${this.errors.length}`)}`);
    }
    newSpinner() {
        this.spinner = ora(chalk.yellowBright(`Downloading ${this.errors.length + this.successFiles.length}/${this.count} | ` +
            `${chalk.greenBright(`Success: ${this.successFiles.length}`)} | ` +
            `${chalk.redBright(`Error: ${this.errors.length}`)}`)).start();
    }
    finishAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => {
                this.callback = resolve;
            });
        });
    }
    get errorHandler() {
        return this._onError.bind(this);
    }
    get successHandler() {
        return this._onSuccess.bind(this);
    }
}
exports.default = DownloadEventHandler;
class DownloadError extends Error {
    constructor(message, fileName) {
        super(message);
        this.fileName = fileName;
    }
}
exports.DownloadError = DownloadError;
//# sourceMappingURL=DownloadEventHandler.js.map