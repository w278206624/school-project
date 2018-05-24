import {getTag} from "./getTag";

export function isArray<T = any> (target: any): target is Array<T> {
	return getTag(target) === "[object Array]";
}
