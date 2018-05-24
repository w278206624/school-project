import {AxiosRequestConfig} from "axios";
import {frontServers, servers} from "../pages/config";
import {request} from "specUtils/request";
import moment from "moment";

interface IRequestNewsParams {
	isDraft: boolean;
	max: number;
	topage: number;
	AreaIds?: string;
	Sortmode?: string;
	TopLevel?: number;
}

export class ArticleNetworkUtil {
	public static cancelRequest = request.cancel;
	
	public static allocationId () {
		return request.get(servers.allocationArticleIdUrl);
	}
	
	public static getCount (areaId, config?: AxiosRequestConfig) {
		return request
			.get(servers.getArticlesLenUrl, {
				params: {
					AreaID: areaId,
				},
				...config,
			})
			.then(({code, msg, Counts}) => ({
				code,
				msg,
				count: Counts,
			}));
	}
	
	public static uploadImg (id, file, config?: AxiosRequestConfig) {
		const fd = new FormData();
		fd.append("id", id);
		fd.append("file", file);
		return request.post(servers.uploadArticleImgUrl, fd, config);
	}
	
	public static requestArticleForFront (id: string | number, config: AxiosRequestConfig = {}) {
		request
			.get(servers.getArticleUrl, {
				params: {
					ID: id,
				},
				...config,
			})
			.then(data => {
				console.log(data);
			});
		return request
			.get(servers.getArticleUrl, {
				params: {
					ID: id,
				},
				...config,
			})
			.then(data => ({
				...data,
				data: this.formatToLocal(data.data),
			}));
	}
	
	public static requestArticlesForFront (params: {
		max: number;
		topage: number;
		TopLevel?: number;
		AreaIds?: string;
	}, config: AxiosRequestConfig = {}) {
		return request
			.get(frontServers.getArticlesUrl, {
				params,
				...config,
			})
			.then(({code, msg, data, Counts}) => {
				return {
					code,
					msg,
					count: Counts,
					data: typeof data === "object" ? data.map(data => this.formatToLocal(data)) : [],
				};
			});
	}
	
	public static requestArticle (id: string | number, config: AxiosRequestConfig = {}) {
		return request
			.get(servers.getArticleUrl, {
				params: {
					ID: id,
				},
				...config,
			})
			.then(data => ({
				...data,
				data: this.formatToLocal(data.data),
			}));
	}
	
	public static requestArticles (params: IRequestNewsParams, config: AxiosRequestConfig = {}) {
		return request
			.get(servers.getArticlesUrl, {
				params,
				...config,
			})
			.then(({
				       code,
				       msg,
				       data,
				       Counts,
			       }) => {
				return {
					code,
					msg,
					count: Counts,
					data: data.map(data => this.formatToLocal(data)),
				};
			});
	}
	
	public static updateArticle (data, config: AxiosRequestConfig = {}) {
		data = data.ID ? data : ArticleNetworkUtil.formatToNetwork(data);
		return request.post(servers.updateArticleUrl, data, config);
	}
	
	public static deleteArticle (id: string | number, config: AxiosRequestConfig = {}) {
		const fd = new FormData();
		fd.append("ID", "" + id);
		return request.post(servers.deleteArticleUrl, fd, config);
	}
	
	public static formatToNetwork (data) {
		if (data.ID) {
			return data;
		}
		
		const {
			      areaId,
			      id,
			      title,
			      content,
			      cover,
			      isDraft,
			      topLevel,
		      } = data;
		return {
			AreaId: areaId,
			ID: id,
			Title: title,
			Content: content,
			ImgPath: cover,
			isDraft,
			TopLevel: topLevel,
		}
	}
	
	public static formatToLocal (data) {
		if (data.id) {
			return data;
		}
		
		const {
			      AreaId,
			      ID,
			      Title,
			      Content,
			      ImgPath,
			      isDraft,
			      TopLevel,
			      LastModifiedDate,
		      } = data;
		
		return {
			areaId: AreaId,
			id: ID,
			title: Title,
			content: Content,
			cover: ImgPath,
			isDraft,
			topLevel: TopLevel,
			date: moment.unix(LastModifiedDate),
		}
	}
}