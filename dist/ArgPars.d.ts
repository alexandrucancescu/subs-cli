import * as commander from "commander";
interface Arguments {
    lang: string;
    username?: string;
    password?: string;
    overwrite?: boolean;
    saveLang?: boolean;
    path: string;
    parser: commander.Command;
    notificationOutput: boolean;
    noPrompt: boolean;
}
export default function parse(): Arguments;
export {};
