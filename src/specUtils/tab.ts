import {AxiosRequestConfig} from "axios";
import {request} from "specUtils/request";
import {servers} from "../pages/config";

export class TabNetworkUtil {
	public static getTab (config?: AxiosRequestConfig) {
		return request
			.get(servers.getTabUrl, config)
			.then(({code, msg, data}) => ({
				code,
				msg,
				data: JSON.parse(data),
			}));
	}
	
	public static updateTab (data, config?) {
		return request.post(servers.updateTabUrl, data, config);
	}
}