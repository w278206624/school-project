import {UploadFile} from "antd/lib/upload/interface";
import {isString} from "util";

function accept (file: File | UploadFile, type: string) {
	const fileTypes = file.type.split("/");
	const fileParentType = fileTypes[0];
	const fileSubType = fileTypes[1];
	
	const types = type.split("/");
	const parentType = types[0];
	const subType = types[1];
	
	return fileParentType === parentType
		&& (fileSubType === subType || subType === "*");
}

export function accepts (file: File | UploadFile, type: string | string[]) {
	if (isString(type)) {
		return accept(file, type)
	} else {
		for (let i = 0, len = type.length; i < len; i++) {
			if (accept(file, type[i])) {
				return true;
			}
		}
		return false;
	}
}