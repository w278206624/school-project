export function slideUp (el: HTMLElement,
                         durationMs: number = 300,
                         cb?: Function) {
	el.style.cssText += `transition: height ${durationMs}ms; height: 0; overflow: hidden;`;
	if (cb) {
		setTimeout(cb, durationMs);
	}
}

export function slideDown (el: HTMLElement,
                           durationMs: number = 300,
                           cb?: Function) {
	if (!el.clientHeight) {
		el.style.cssText += `display: block; overflow: hidden; visibility: hidden; transition: height ${durationMs}ms; height: auto;`;
		const height = el.clientHeight;
		el.style.height = "0";
		setTimeout(() => {
			el.style.visibility = "visible";
			el.style.height = `${height}px`;
			
			if (cb) {
				setTimeout(cb, durationMs);
			}
		});
	}
}

export function slideToggle (el: HTMLElement,
                             duration: number = 300,
                             cb?: Function) {
	el.clientHeight ? slideUp(el, duration, cb) : slideDown(el, duration, cb);
}