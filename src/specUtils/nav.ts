import {AxiosRequestConfig} from "axios";
import {request} from "specUtils/request";
import {servers} from "../pages/config";
import {INavItem} from "../pages/index/components/Nav";

export class NavNetworkUtil {
	public static linkArticles (areaId: string,
	                            articleIds: Array<string | number>,
	                            config?: AxiosRequestConfig) {
		const fd = new FormData();
		fd.append("AreaId", areaId);
		fd.append("NewsIDs", articleIds.join(","));
		return request.post(servers.navLinkArticlesUrl, fd, config);
	}
	
	public static getNav (config?: AxiosRequestConfig) {
		return request
			.get(servers.getNavUrl, config)
			.then(({Code, Messages, Data}) => ({
				code: Code,
				msg: Messages,
				data: JSON.parse(Data),
			}));
	}
	
	public static updateNav (data, config?: AxiosRequestConfig) {
		return request
			.post(servers.updateNavUrl, data, config)
			.then(({Code, Messages}) => ({
				code: Code,
				msg: Messages,
			}));
	}
	
	public static deleteNav (ids: string[], config?: AxiosRequestConfig) {
		const fd = new FormData();
		fd.append("AreaIds", ids.join(","));
		return request.post(servers.deleteNavUrl, fd, config);
	}
}

export function findNavById (id: string,
                             navList: Array<INavItem>,
                             parent?: INavItem) {
	for (let i = 0, len = navList.length; i < len; i++) {
		const nav = navList[i];
		let findNav;
		if (nav.id === id) {
			findNav = {...nav, parent};
		} else {
			const _parent = {...nav, parent};
			findNav = findNavById(id, nav.children, _parent);
		}
		
		if (findNav) {
			return findNav
		}
	}
}

export function getNavPathById (id: string,
                                navList: Array<INavItem>) {
	if (navList.length) {
		const nav = findNavById(id, navList);
		let paths = ["暂无分区"];
		
		if (nav) {
			paths = [nav.title];
			while (nav.parent) {
				paths.unshift(nav.parent.title);
				nav.parent = nav.parent.parent;
			}
		}
		return paths.join(" / ");
	}
}

export function getBreadcrumbsByNavId (id: string, navList: Array<INavItem>) {
	let nav = findNavById(id, navList);
	let result = [];
	if (nav) {
		while (nav.parent) {
			const {title, id} = nav;
			result.unshift({
				name: title,
				to: {
					pathname: "newsPart",
					query: {
						title,
						id,
					},
				},
			});
			nav = nav.parent;
		}
	}
	return result;
}