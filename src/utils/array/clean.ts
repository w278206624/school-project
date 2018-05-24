function baseClean (arr: any[], item: any) {
	return arr.filter((value) => value !== item);
}

export function clean (arr: any[], ...item: any[]) {
	let result = arr;
	
	item.forEach((value) => {
		result = baseClean(result, value);
	});
	
	return result;
}
