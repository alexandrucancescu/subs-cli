import * as commander from "commander"
import {readJsonSync} from "fs-extra"
import {join} from "path"

interface Arguments{
	lang:string;
	username?:string;
	password?:string;
	overwrite?:boolean;
	saveLang?:boolean;
	path:string;
	parser:commander.Command,
}

export default function parse():Arguments{
	const pack=readJsonSync(join(__dirname,"../package.json"));
	const program=new commander.Command(pack.name);
	program.version(pack.version);

	program.option("-l, --lang <value>","the language of the subtitles (eng/en, fr/fre, ro/rum, ...) (default: eng)");
	// program.option("-u, --username <value>","username on opensubtitles.org");
	// program.option("-p, --password <value>","password on opensubtitles.org");
	program.option("-o, --overwrite","overwrite existing subtitles",false);
	program.option("-p, --path","path of file or dir of files to download subtitles for");
	program.option("-s, --save-lang","save the current language as default");
	program.usage("<path> [options]")

	program.parse(process.argv);

	// console.log(program.opts())

	return {
		lang:program.lang,
		username:program.username,
		password:program.password,
		overwrite:program.overwrite ?? false,
		saveLang:program.saveLang ?? false,
		path:program.args[0],
		parser:program,
	}
}