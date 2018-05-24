import {autoPrefixTime} from "utils/autoPrefix";

export function formatDate (date: Date | number | string): string {
	if (!date) {
		return formatDate(new Date());
	} else if (typeof date === "number" || typeof date === "string") {
		return formatDate(new Date(date));
	}
	
	const year  = date.getFullYear(),
	      month = date.getMonth(),
	      day   = date.getDay(),
	      hours = autoPrefixTime(date.getHours()),
	      min   = autoPrefixTime(date.getMinutes());
	
	return `${year}-${month}-${day} ${hours}:${min}`;
}
