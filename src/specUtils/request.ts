import axios, {AxiosRequestConfig} from "axios";

const {CancelToken} = axios;

interface Request<T = any> {
	(config?: AxiosRequestConfig): Promise<T>;
	
	get? (url: string, config?: AxiosRequestConfig): Promise<T>;
	
	post? (url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
	
	put? (url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
	
	delete? (url: string, config?: AxiosRequestConfig): Promise<T>;
	
	cancel? (request?: Request): void;
}

let requests = [];
let cancels = [];

function emptyFn () {}

// fix me: cannot cancel sign request
export const request: Request = function (config = {}) {
	const promise = new Promise((resolve, reject) => {
		const id = cancels.push(emptyFn);
		axios
			.request({
				timeout: 5000,
				cancelToken: new CancelToken(c => {
					cancels[id] = c;
				}),
				...config,
			})
			.then(res => {
				cancels.splice(id, 1);
				requests.splice(id, 1);
				resolve(res.data);
			})
			.catch(err => {
				cancels.splice(id, 1);
				requests.splice(id, 1);
				reject(err);
			});
	});
	return promise;
};

request.get = function (url: string, config = {}) {
	return request({
		url,
		method: "GET",
		...config,
	})
};

request.post = function (url: string, data?, config = {}) {
	return request({
		url,
		data,
		method: "POST",
		...config,
	});
};

request.put = function (url: string, data?, config = {}) {
	return request({
		url,
		data,
		method: "PUT",
		...config,
	});
};

request.delete = function (url: string, config = {}) {
	return request({
		url,
		method: "DELETE",
		...config,
	})
};

request.cancel = function (request?) {
	if (request !== undefined) {
		const index = requests.indexOf(request);
		if (index !== -1) {
			cancels[index]();
			requests.splice(index, 1);
			cancels.splice(index, 1);
		}
	} else {
		cancels.forEach(cancel => cancel());
		requests = [];
		cancels = [];
	}
};
