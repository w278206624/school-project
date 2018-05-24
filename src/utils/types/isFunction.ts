// the low version chrome typeof regex will return function, is a bug
export const isFunction = typeof /./ !== "function"
	? (target: any): target is Function => typeof target === "function"
	: (target: any): target is Function => Object.prototype.toString.call(target) === "[object Function]";
