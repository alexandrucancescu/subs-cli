import {remove} from "fs-extra"
import {PREF_DIR} from "./Preferences"

remove(PREF_DIR)
	.then(()=>console.log("Preferences directory removed"))
	.catch(e=>console.error(e));

