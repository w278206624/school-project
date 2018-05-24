import {request} from "specUtils/request";
import {servers} from "../pages/config";

export class LoginNetworkUtil {
	public static getPublicKey () {
		return request.get(servers.getPublicKeyUrl);
	}
	
	public static requestLogin (data) {
		return request.post(servers.loginUrl, data);
	}
}