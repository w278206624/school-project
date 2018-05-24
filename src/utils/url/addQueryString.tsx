import {isString} from "utils/types";

function str2kv (str: string) {
	const result = {};
	str
		.split("&")
		.forEach(item => {
			const kv = item.split("=");
			result[kv[0]] = kv[1];
		});
	return result;
}

function kv2str (kv: { [key: string]: any }) {
	let result = "";
	Object
		.keys(kv)
		.forEach((key, i, arr) => {
			result += `${key}=${kv[key]}${i !== arr.length - 1 ? "&" : ""}`;
		});
	return result;
}

export function addQueryString (query: string | { [key: string]: any }) {
	let url = location.href;
	const queryIndex = url.indexOf("?");
	let kvQueryString = {};
	
	if (queryIndex !== -1) {
		kvQueryString = str2kv(url.substring(queryIndex + 1));
		url = url.slice(0, queryIndex);
	}
	
	if (isString(query)) {
		kvQueryString = {...kvQueryString, ...str2kv(query)};
	} else {
		kvQueryString = {...kvQueryString, ...query};
	}
	url += "?" + kv2str(kvQueryString);
	location.href = url;
}