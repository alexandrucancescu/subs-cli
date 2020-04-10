# Subtitles CLI

A full featured, easy to use, CLI app to download subtitles from opensubtitles.org.

![](subs-terminal.gif)

## Features

-  🎞 Download subtitles for movie file or entire folder
-  ⌨️ Login with your opensubtitles.org account
-  🏝 Stores preferences for language and opensubtitles.org account
-  ⚔️ Secure! Your account credentials are stored encrypted by your operating system using Keychain/Credential Vault/Secret Service API
-  ⌛️ Shows download quota from opensubtitles.org

## Install

```shell script
npm install -g subs-cli
``` 

## Usage

##### Download subtitles for all the video files in a directory
```
subs /path/to/dir
```

##### Download subtitles for a single video file
```
subs /path/to/file.mkv
```

##### Help
```
subs -h

Usage: subs <path> [options]

Options:
  -V, --version       output the version number
  -l, --lang <value>  the language of the subtitles (eng/en, fr/fre, ro/rum,
                      ...) (default: eng)
  -o, --overwrite     overwrite existing subtitles (default: false)
  -p, --path          path of file or dir of files to download subtitles for
  -s, --save-lang     save the current language as default
  -h, --help          display help for command
```

##### Save language

If a language is specified with **--lang** option, using **--save-lang** flag will save it as the default language
 
##### Overwrite

Using **--overwrite** flag will download and overwrite existing subtitles. Default behaviour is to ignore videos that already have subtitles.

## License

The code in this project is licensed under the MIT License. See [LICENSE](LICENSE) for details.