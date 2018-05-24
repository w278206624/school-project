export let formatHtml = (htmlString: string) => "";

if (typeof document !== "undefined") {
	const el = document.createElement("div");
	formatHtml = (htmlString: string) => {
		el.innerHTML = htmlString;
		return el.textContent;
	}
}

