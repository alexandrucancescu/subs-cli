export declare const PREF_DIR: string;
declare class Preferences {
    private _lang;
    private _account;
    private _useragent;
    loadPreferences(): Promise<void>;
    writeFile(): void;
    get lang(): string;
    get account(): string;
    get useragent(): string;
    set lang(value: string);
    set account(value: string);
    set useragent(value: string);
}
declare const _default: Preferences;
export default _default;
