import {isArray} from "util";

export function deepMap<T = any> (arr: T[],
                                  mapFn: (value: T, index: number, array: T[]) => any,
                                  thisArg: any = arr): Array<any> {
	return arr.map(
		function (value, index, array) {
			if (isArray(value)) {
				return deepMap<T>(value as any, mapFn, this);
			} else {
				return mapFn.call(this, value, index, array);
			}
		},
		thisArg,
	);
}
