import {readJsonSync} from "fs-extra";
import {join} from "path"
import * as https from "https"
import {createUnzip} from "zlib"
import {pipeline,Readable} from "stream"
import {promisify} from "util";
import {createWriteStream} from "fs";
import {ILanguage} from "./Types";
import {IncomingHttpHeaders} from "http";

const pipe=promisify(pipeline);

export function isString(...str:string[]):boolean{
	for(let s of str){
		if(typeof s !== "string" || s.length<1){
			return false;
		}
	}
	return true;
}

export function getLang(lang:string):ILanguage{
	const languages:ILanguage[]=readJsonSync(join(__dirname,"../langs.json"));

	let code=null;
	if(lang.length===2){
		code=languages.find(l=>l.alpha2===lang);
	}else if(lang.length===3){
		code=languages.find(l=>l.alpha3===lang);
	}

	return code;
}

export async function downloadFile(url:string,path:string,unzip:boolean=true):Promise<IncomingHttpHeaders>{
	return new Promise<IncomingHttpHeaders>((resolve,reject)=>{
		https.get(url,{
			headers:{
				"User-Agent":"TemporaryUserAgent"
			}
		},res=>{
			if(res.statusCode===200){
				let writeFile:Promise<any>;

				let fStream=createWriteStream(path);
				if(unzip){
					writeFile=pipe(res,createUnzip(),fStream);
				}

				writeFile
					.then(()=>resolve(res.headers))
					.catch(e=>reject(new Error(e.message)));
			}else{
				reject(new Error(`${res.statusCode} ${res.statusMessage}`));
			}
		});
	});
}