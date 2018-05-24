const toString = Object.prototype.toString;

export function getTag (target: any) {
	return toString.call(target);
}
