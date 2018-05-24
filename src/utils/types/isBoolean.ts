export function isBoolean (target: any): target is boolean {
	return typeof target === "boolean"
		// if target is boolean object
		|| Object.prototype.toString.call(target) === "[object Boolean]";
}
