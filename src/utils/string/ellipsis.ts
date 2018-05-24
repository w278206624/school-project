export function ellipsis (str: string,
                          length: number = 100,
                          char: string   = ".",
) {
	if (str.length > length) {
		const cutStr = str.slice(0, length - 3);
		return cutStr.split("").concat([char, char, char]).join("");
	} else {
		return str;
	}
}