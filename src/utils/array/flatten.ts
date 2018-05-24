import {isArray} from "util";

export function flatten (arr: any[]) {
	let result: any[] = [];
	
	arr.forEach((value) => {
		if (isArray(value)) {
			result = result.concat(flatten(value));
		} else {
			result.push(value);
		}
	});
	
	return result;
}
