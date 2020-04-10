import * as ora from "ora";
import * as chalk from "chalk";

export interface DownloadResult{
	err:DownloadError[];
	success:string[];
}

type Callback=(res:DownloadResult)=>void;

export default class DownloadEventHandler{
	private spinner:ora.Ora;
	private errors:DownloadError[]=[];
	private successFiles:string[]=[];
	private readonly count:number;
	private callback:Callback;

	constructor(count:number) {
		this.count=count;
		this.newSpinner();
	}

	private _onError(error:DownloadError){
		this.errors.push(error);
		this.newEntry();
	}

	private _onSuccess(fileName:string){
		this.successFiles.push(fileName);
		this.newEntry();
	}

	private newEntry(){
		this.updateSpinner();
		if(this.errors.length + this.successFiles.length===this.count){
			this.stopSpinner();
			this.callback({
				err:this.errors,
				success:this.successFiles,
			})
		}
	}

	private stopSpinner(){
		const func = this.errors.length > 0 ? (this.successFiles.length > 0 ? "warn" : "fail") : "succeed";
		this.spinner[func](
			chalk.yellowBright(
				`Done ${this.errors.length+this.successFiles.length}/${this.count} | `+
				`${chalk.greenBright(`Success: ${this.successFiles.length}`)} | ` +
				`${chalk.redBright(`Error: ${this.errors.length}`)}`
			)
		);
	}

	private updateSpinner(){
		this.spinner.text= chalk.yellowBright(
				`Downloading ${this.errors.length+this.successFiles.length}/${this.count} | `+
				`${chalk.greenBright(`Success: ${this.successFiles.length}`)} | ` +
				`${chalk.redBright(`Error: ${this.errors.length}`)}`
		)
	}

	private newSpinner(){
		this.spinner=ora(
			chalk.yellowBright(
				`Downloading ${this.errors.length+this.successFiles.length}/${this.count} | `+
				`${chalk.greenBright(`Success: ${this.successFiles.length}`)} | ` +
				`${chalk.redBright(`Error: ${this.errors.length}`)}`
			)
		).start();
	}

	public async finishAll():Promise<DownloadResult>{
		return new Promise<DownloadResult>(resolve => {
			this.callback=resolve;
		});
	}

	get errorHandler():(e:Error)=>void{
		return this._onError.bind(this);
	}

	get successHandler():(f:string)=>void{
		return this._onSuccess.bind(this);
	}
}

export class DownloadError extends Error{
	public readonly fileName:string;

	constructor(message:string,fileName:string) {
		super(message);
		this.fileName=fileName;
	}
}