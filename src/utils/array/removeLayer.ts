export function removeLayer<T = any> (arrLike: T[],
                                      path: number[],
                                      property?: string) {
	let data = arrLike[path[0]];
	const len = path.length;
	if (len > 1) {
		
		for (let i = 1; i < len - 1; i++) {
			if (property) {
				data = data[property][path[i]];
			} else {
				data = data[path[i]]
			}
		}
		if (property) {
			return data[property].splice(path[len - 1], 1);
		} else if (Array.isArray(data)) {
			return data.splice(path[len - 1], 1);
		}
	} else {
		return arrLike.splice(path[0], 1);
	}
}