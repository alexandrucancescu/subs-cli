/// <reference types="node" />
import { ILanguage } from "./Types";
import { IncomingHttpHeaders } from "http";
export declare function isString(...str: string[]): boolean;
export declare function getLang(lang: string): ILanguage;
export declare function downloadFile(url: string, path: string, unzip?: boolean): Promise<IncomingHttpHeaders>;
