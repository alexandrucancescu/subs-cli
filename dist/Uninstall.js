"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = require("fs-extra");
const Preferences_1 = require("./Preferences");
fs_extra_1.remove(Preferences_1.PREF_DIR)
    .then(() => console.log("Preferences directory removed"))
    .catch(e => console.error(e));
//# sourceMappingURL=Uninstall.js.map