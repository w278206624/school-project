/**
 * e.g:
 * (123) // true
 * ("sdf") // false
 * ("2132") // true
 * (Number(1234)) // true
 * (Number("123")) // true
 * (Number("sdfsdf123123")) // false
 * @param target
 * @returns {boolean}
 */
export function isNumber (target: any): target is number {
	return !isNaN(+target);
}
