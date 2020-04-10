import {join,isAbsolute,basename} from "path"
import {readFileSync, pathExistsSync, lstatSync, readdirSync} from "fs-extra"
import parseArguments from "./ArgPars"
import * as chalk from "chalk";
import Preferences from "./Preferences";
import authenticate from "./Authentication";
import {downloadFile, getLang, isString} from "./Util";
import DownloadEventHandler, {DownloadError, DownloadResult} from "./DownloadEventHandler";
import {ILanguage, IOpenSubtitles, ISubInfo} from "./Types";


const args=parseArguments();

let osub:IOpenSubtitles;

let quota:number=-Infinity;

async function start(){
	const targetPath=getPath();

	const files=getFiles(targetPath);

	if(files.length<1){
		console.log(chalk.yellowBright("\nNo files found\n"));
		return;
	}

	await Preferences.loadPreferences();

	const lang=getLanguage();

	// await downloadFile(
	// 	"https://dl.opensubtitles.org/en/download/src-api/vrf-19cc0c5d/sid-5db4NRRCgE4S2f0cf7hygCtGqTf/file/1953905758.gz",
	// 	// "https://img.freepik.com/free-vector/abstract-technology-particle-background_52683-25766i.jpg?size=626&ext=jpg",
	// 	"/Users/andu/Downloads/sub.srt",
	// 	true,
	// );

	osub=await authenticate();

	const downloadWatcher=new DownloadEventHandler(files.length);

	for(let file of files){
		downloadSubtitle(file,lang)
			.then(downloadWatcher.successHandler)
			.catch(downloadWatcher.errorHandler)
	}

	const result=await downloadWatcher.finishAll();

	printResult(result);

	if(quota>-1){
		console.log(chalk.yellowBright(`\n OpenSubtitle.org download quota: ${chalk.bold(quota)}`));
	}


	// const subs=await (await authenticate()).search({
	// 	sublanguageid:"eng",
	// 	path:"/Users/andu/Downloads/Breaking.Bad.S05.1080p.BluRay.x264-ROVERS/breaking.bad.s05e11.1080p.bluray.x264-rovers.mkv",
	// 	filename:"breaking.bad.s05e11.1080p.bluray.x264-rovers.mkv",
	// 	gzip:true,
	// });
	//
	// console.log(subs);
}

function printResult(result:DownloadResult){
	if(result.success.length>0){
		console.log();

		console.log(chalk.bold.green("  SUCCESS:"));
		for(let fileName of result.success){
			console.log(chalk.green("✔ ")+chalk.greenBright(`${fileName}`))
		}
	}

	if(result.err.length>0){
		console.log();

		console.log(chalk.bold.red("  ERRORS:"));
		for(let error of result.err){
			console.log(chalk.red("✖ ")+chalk.redBright(`${error.fileName} ${chalk.red(error.message)}`))
		}
	}
}

async function downloadSubtitle(file:string,lang:ILanguage):Promise<string>{
	const fileBaseName=basename(file);

	const subs=await searchSubtitles(file,lang);

	if(subs.length<1){
		throw new DownloadError("No subtitles found",fileBaseName);
	}

	try{
		const headers=await downloadFile(subs[0].url,file.replace(/\.[^.]*$/, `.${subs[0].format}`),true);

		const dowQuota=Number.parseInt(<string>headers["download-quota"]);
		if(!Number.isNaN(dowQuota)){
			quota=dowQuota;
		}
	}catch (e) {
		throw new DownloadError(e.message,fileBaseName);
	}

	return fileBaseName;
}

async function searchSubtitles(videoFile:string,lang:ILanguage):Promise<ISubInfo[]>{
	const subsFound=await osub.search({
		sublanguageid: lang.alpha3,
		path:videoFile,
		filename: basename(videoFile),
		gzip:true,
	});

	return Object.values(subsFound).filter(s=>s.langcode===lang.alpha2);
}
function getLanguage():ILanguage{
	const lang=getLang(args.lang ?? Preferences.lang ?? "eng");
	if(lang!==null){
		const isDefault=(lang.alpha3!==Preferences.lang && !args.saveLang);
		console.log(
			chalk.greenBright(
				`Language set to ${chalk.yellow(lang.name)}` +
				(isDefault ? `. To save as default add ${chalk.blueBright("-s")} option` : " as default") +
				"\n"
			)
		);

		if(args.saveLang===true){
			Preferences.lang=lang.alpha3;
		}
		return lang;
	}else{
		console.error(chalk.redBright(`No language found for code ${chalk.red(args.lang)}`));
		process.exit(0);
	}
}

function getPath():string{

	let targetPath:string;

	if(!isString(args.path)){
		console.error(chalk.redBright.bold("No path specified!\n"));
		console.log(args.parser.helpInformation());
		process.exit(0);
	}

	if(isAbsolute(args.path)){
		targetPath=args.path;
	}else{
		targetPath=join(process.cwd(),args.path);
	}

	if(!pathExistsSync(targetPath)){
		console.error(chalk.redBright(`Path '${chalk.bold.red(targetPath)}' doesn't exist`));
		process.exit(0);
	}

	return targetPath;
}

function getFiles(targetPath:string):string[]{
	let files:string[]=null;

	const lstatRes=lstatSync(targetPath);
	if(lstatRes.isFile() && isVideoFile(targetPath)){
		files=[targetPath];
	}else if(lstatRes.isDirectory()){
		files=readdirSync(targetPath)
			.filter(isVideoFile)
			.map(fn=>join(targetPath,fn));
		if(args.overwrite===false){
			files=files.filter(path=>
				!pathExistsSync(path.replace(/\.[^.]*$/, ".srt"))
			)
		}
	}

	return files;
}

function isVideoFile(path:string){
	const ext=path.split(".").pop() ?? null;

	return extensions.indexOf(ext)>-1;
}

const extensions:string[]=JSON.parse(
	readFileSync(
		join(__dirname,"../extensions.json"),{encoding:"utf8"}
	)
);

start().catch(e=>console.error(e));