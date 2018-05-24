export function fadeIn (el: HTMLElement,
                        durationMs: number = 300,
                        cb?: Function) {
	if (el.style.opacity === "1" || window.getComputedStyle(el).opacity === "1") {
		return;
	}
	
	el.style.cssText = `transition: opacity ${durationMs}ms; opacity: 0;`;
	setTimeout(() => {
		el.style.opacity = "" + 1;
		if (cb) {
			setTimeout(cb, durationMs);
		}
	});
	return el;
}

export function fadeOut (el: HTMLElement,
                         durationMs: number = 300,
                         cb?: Function) {
	if (el.style.opacity === "0" || window.getComputedStyle(el).opacity === "0") {
		return;
	}
	
	el.style.cssText = `transition: opacity ${durationMs}ms; opacity: 1;`;
	setTimeout(() => {
		el.style.opacity = "" + 0;
		if (cb) {
			setTimeout(cb, durationMs);
		}
	});
	return el;
}

export function fadeToggle (el: HTMLElement,
                            durationMs: number = 300,
                            cb?: Function) {
	if (el.style.opacity === "0" || window.getComputedStyle(el).opacity === "0") {
		fadeIn(el, durationMs, cb);
	} else {
		fadeOut(el, durationMs, cb);
	}
}