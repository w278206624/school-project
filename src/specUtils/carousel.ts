import {AxiosRequestConfig} from "axios";
import {request} from "specUtils/request";
import {servers} from "../pages/config";

interface ICarouselData {
	src: string;
	desc?: string;
	file?: any;
	articleId: string | number;
}

export class CarouselNetworkUtil {
	public static cancelRequest = request.cancel;
	
	public static getCarousels (config: AxiosRequestConfig = {}) {
		return request
			.get(servers.getCarouselsUrl, config)
			.then(({Code, Data, Messages}) => ({
				code: Code,
				msg: Messages,
				data: Data,
			}));
	}
	
	public static updateCarousels (carousels: Array<ICarouselData>, config: AxiosRequestConfig = {}) {
		const fd = new FormData();
		carousels.forEach(({src, desc, file, articleId}, i) => {
			fd.append("Order", "" + i);
			fd.append("Val", "true");
			fd.append("Link", articleId ? "" + articleId : "");
			fd.append("Title", desc || "");
			fd.append("file", file);
			fd.append("ImgPath", !!file ? "" : src);
		});
		return request
			.post(servers.updateCarouselsUrl, fd, config)
			.then(({Code, Messages, Data}) => ({
				code: Code,
				msg: Messages,
				data: Data,
			}));
	}
	
	public static formatToLocal (data) {
		const {ID, Title, ImgPath, Link} = data;
		return {
			id: ID,
			title: Title,
			cover: ImgPath,
			link: Link,
		}
	}
	
	public static formatToNetwork (data) {
		const {id, title, cover, link} = data;
		return {
			ID: id,
			Title: title,
			ImgPath: cover,
			Link: link,
		}
	}
}