import * as commander from "commander";
interface Arguments {
    lang: string;
    username?: string;
    password?: string;
    overwrite?: boolean;
    saveLang?: boolean;
    path: string;
    parser: commander.Command;
}
export default function parse(): Arguments;
export {};
