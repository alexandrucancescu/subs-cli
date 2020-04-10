
export interface ISubInfo{
	url:string;
	langcode:string;
	filename:string;
	format:string;
}

interface ISubSearchResult{
	[key:string]:ISubInfo;
}

export interface IOpenSubtitles{
	search(options:{
		filename?:string;
		path?:string;
		sublanguageid?:string;
		gzip?:boolean;
	}):ISubSearchResult;
}

export interface ILanguage{
	name:string;
	alpha2:string;
	alpha3:string;
}