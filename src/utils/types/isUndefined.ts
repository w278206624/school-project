const undef: undefined = void 0;

export function isUndefined (target: any): target is undefined {
	return target === undef;
}
