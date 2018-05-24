export function compact<T = any> (arr: T[]) {
	return arr.filter((v) => !!v);
}
