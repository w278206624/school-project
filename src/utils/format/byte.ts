const limit = {
	b: 1,
	kb: 1024,
	mb: 1024 * 1024,
	gb: 1024 * 1024 * 1024,
};

export function formatByte (byte: number) {
	const {kb, mb, gb} = limit;
	let unit = "b";
	
	if (byte > gb) {
		unit = "gb";
	} else if (byte > mb) {
		unit = "mb";
	} else if (byte > kb) {
		unit = "kb";
	}
	return `${(byte / limit[unit]).toFixed(1)}${unit}`;
}