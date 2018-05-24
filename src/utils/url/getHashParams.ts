export function getHashParams (url = location.href): any {
	let result = {};
	const hashIndex = url.indexOf("#");
	
	if (hashIndex === -1) {
		return result;
	}
	
	const hash = url.substring(hashIndex + 1);
	const queryIndex = hash.indexOf("?");
	
	if (queryIndex !== -1) {
		const params = hash.slice(queryIndex + 1).split("&");
		params.forEach((param) => {
			const kv = param.split("=");
			const key = kv[0];
			let value = kv[1];
			result[key] = value;
		});
	}
	
	return result;
}