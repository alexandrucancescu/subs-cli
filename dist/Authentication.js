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
const keytar = require("keytar");
const chalk = require("chalk");
const inquirer_1 = require("inquirer");
const Util_1 = require("./Util");
const OpenSubtitles = require("opensubtitles-api");
const ora = require("ora");
const Preferences_1 = require("./Preferences");
function authenticate() {
    return __awaiter(this, void 0, void 0, function* () {
        let accounts = yield keytar.findCredentials("opensubtitles.org");
        return getCredentialsRec(accounts);
    });
}
exports.default = authenticate;
function getCredentialsRec(accounts, triedAccounts = [], firstPass = true) {
    return __awaiter(this, void 0, void 0, function* () {
        let credentials = null;
        const validAccounts = accounts.filter(acc => triedAccounts.indexOf(acc.account) < 0);
        if (validAccounts.length > 0) {
            if (firstPass && accounts.findIndex(acc => acc.account === Preferences_1.default.account) > -1) {
                credentials = accounts.find(acc => acc.account === Preferences_1.default.account);
            }
            else {
                credentials = yield inquireAccount(validAccounts);
            }
            if (credentials !== null) {
                triedAccounts.push(credentials.account);
            }
        }
        if (credentials === null) {
            if (firstPass) {
                console.log(chalk.yellowBright("No account found for opensubtitles.org"));
                console.log(chalk.yellowBright("You will be prompted to add your credentials for opensubtitles.org. This information is stored securely by your OS"));
            }
            console.log();
            credentials = yield inquireCredentials();
        }
        let osub = yield tryCredentials(credentials);
        if (osub !== null) {
            yield keytar.setPassword("opensubtitles.org", credentials.account, credentials.password);
            Preferences_1.default.account = credentials.account;
            return osub;
        }
        else {
            return getCredentialsRec(accounts, triedAccounts, false);
        }
    });
}
function tryCredentials(credentials) {
    return __awaiter(this, void 0, void 0, function* () {
        const spinner = ora(chalk.yellow(`Logging in ${credentials.account}`)).start();
        try {
            const osub = new OpenSubtitles({
                username: credentials.account,
                password: credentials.password,
                ssl: true,
                useragent: "TemporaryUserAgent"
            });
            yield osub.login();
            spinner.succeed(`Successfully logged in as ${chalk.blueBright(credentials.account)}`);
            return osub;
        }
        catch (e) {
            // console.error(e);
            spinner.fail(`Failed to log in as ${chalk.blueBright(credentials.account)}. Error: ${chalk.redBright(e.message)}`);
            return null;
        }
    });
}
function inquireAccount(accounts) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const accountName = yield inquirer_1.prompt([{
                type: "list",
                name: "account",
                choices: [...accounts.map(acc => acc.account), "Other"],
                message: "Which opensubtitles account fo you wish to use?"
            }]);
        return (_a = accounts.find(acc => acc.account === accountName.account)) !== null && _a !== void 0 ? _a : null;
    });
}
function inquireCredentials() {
    return __awaiter(this, void 0, void 0, function* () {
        while (true) {
            const credentials = yield inquirer_1.prompt([
                { type: "input", name: "account", message: "Username:" },
                { type: "password", name: "password", message: "Password:" }
            ]);
            if (Util_1.isString(credentials.password, credentials.account)) {
                return credentials;
            }
            else {
                console.log(chalk.redBright("\nUsername/Password cannot be empty!\n"));
            }
        }
    });
}
//# sourceMappingURL=Authentication.js.map