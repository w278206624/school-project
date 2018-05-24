export function on (el: EventTarget,
                    type: string,
                    listener: EventListener) {
	if (window.addEventListener) {
		el.addEventListener(type, listener);
	} else {
		(el as any).attachEvent("on" + type, listener);
	}
}

export function off (el: EventTarget,
                     type: string,
                     listener: EventListener) {
	if (window.removeEventListener) {
		el.removeEventListener(type, listener);
	} else {
		(el as any).detach("on" + type, listener);
	}
}