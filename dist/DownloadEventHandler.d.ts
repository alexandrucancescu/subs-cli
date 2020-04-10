export interface DownloadResult {
    err: DownloadError[];
    success: string[];
}
export default class DownloadEventHandler {
    private spinner;
    private errors;
    private successFiles;
    private readonly count;
    private callback;
    constructor(count: number);
    private _onError;
    private _onSuccess;
    private newEntry;
    private stopSpinner;
    private updateSpinner;
    private newSpinner;
    finishAll(): Promise<DownloadResult>;
    get errorHandler(): (e: Error) => void;
    get successHandler(): (f: string) => void;
}
export declare class DownloadError extends Error {
    readonly fileName: string;
    constructor(message: string, fileName: string);
}
