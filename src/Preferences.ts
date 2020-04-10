import {getDataHome} from "platform-folders"
import {ensureFile,readJson,writeJsonSync} from "fs-extra"
import {join} from "path";

export const PREF_DIR=join(getDataHome(),"Subtitles CLI");
const PREF_FILE=join(PREF_DIR,"preferences.json");

interface IPreferences {
	lang:string;
	account:string;
	useragent?:string;
}

class Preferences{
	private _lang:string;
	private _account:string;
	private _useragent:string;

	public async loadPreferences(){
		await ensureFile(PREF_FILE);

		try{
			const pref:IPreferences=await readJson(PREF_FILE);
			this._lang=pref.lang;
			this._account=pref.account;
			this._useragent=pref.useragent;
		}catch (e) {
			this.writeFile();
		}
	}

	public writeFile(){
		writeJsonSync(PREF_FILE,{
			lang:this._lang,
			account:this._account,
			useragent:this._useragent
		});
	}

	get lang():string{
		return this._lang;
	}

	get account():string{
		return this._account;
	}

	get useragent():string{
		return this._account;
	}

	set lang(value:string){
		this._lang=value;
		this.writeFile();
	}

	set account(value:string){
		this._account=value;
		this.writeFile();
	}

	set useragent(value:string){
		this._useragent=value;
		this.writeFile();
	}
}

export default new Preferences();