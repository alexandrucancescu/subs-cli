import * as keytar from "keytar"
import * as chalk from "chalk"
import {prompt} from "inquirer"
import {isString} from "./Util";
import * as OpenSubtitles from "opensubtitles-api"
import * as ora from "ora"
import Preferences from "./Preferences";
import {IOpenSubtitles} from "./Types";

interface Credentials{
	account:string;
	password:string;
}

export default async function authenticate():Promise<IOpenSubtitles>{
	let accounts:Credentials[]=await keytar.findCredentials("opensubtitles.org");

	return getCredentialsRec(accounts);
}

async function getCredentialsRec(accounts:Credentials[],triedAccounts:string[]=[],firstPass:boolean=true):Promise<IOpenSubtitles>{
	let credentials:Credentials=null;

	const validAccounts=accounts.filter(acc=>triedAccounts.indexOf(acc.account)<0);


	if(validAccounts.length>0){
		if(firstPass && accounts.findIndex(acc=>acc.account===Preferences.account)>-1){
			credentials=accounts.find(acc=>acc.account===Preferences.account);
		}else{
			credentials=await inquireAccount(validAccounts);
		}
		if(credentials!==null){
			triedAccounts.push(credentials.account);
		}
	}

	if(credentials===null){
		if(firstPass){
			console.log(chalk.yellowBright("No account found for opensubtitles.org"));
			console.log(chalk.yellowBright("You will be prompted to add your credentials for opensubtitles.org. This information is stored securely by your OS"));
		}
		console.log();
		credentials=await inquireCredentials();
	}

	let osub=await tryCredentials(credentials);
	if(osub!==null){
		await keytar.setPassword("opensubtitles.org",credentials.account,credentials.password);
		Preferences.account=credentials.account;
		return osub;
	}else{
		return getCredentialsRec(accounts,triedAccounts,false);
	}
}

async function tryCredentials(credentials:Credentials):Promise<OpenSubtitles>{
	const spinner=ora(chalk.yellow(`Logging in ${credentials.account}`)).start();
	try{
		const osub=new OpenSubtitles({
			username:credentials.account,
			password:credentials.password,
			ssl:true,
			useragent:"TemporaryUserAgent"
		});
		await osub.login();
		spinner.succeed(`Successfully logged in as ${chalk.blueBright(credentials.account)}`);
		return osub;
	}catch (e) {
		// console.error(e);
		spinner.fail(`Failed to log in as ${chalk.blueBright(credentials.account)}. Error: ${chalk.redBright(e.message)}`);
		return null;
	}
}

async function inquireAccount(accounts:Credentials[]):Promise<Credentials>{
	const accountName=await prompt([{
		type:"list",
		name:"account",
		choices:[...accounts.map(acc=>acc.account),"Other"],
		message:"Which opensubtitles account fo you wish to use?"
	}]);

	return accounts.find(acc=>acc.account===accountName.account) ?? null;
}

async function inquireCredentials():Promise<Credentials>{
	while(true){
		const credentials:Credentials=await prompt([
			{type:"input",name:"account",message:"Username:"},
			{type:"password",name:"password",message:"Password:"}
		]);

		if(isString(credentials.password,credentials.account)){
			return credentials;
		}else{
			console.log(chalk.redBright("\nUsername/Password cannot be empty!\n"))
		}
	}
}

