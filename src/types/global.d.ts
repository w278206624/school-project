import {UrlLike} from "next";
import * as R from "react";
import {INavItem} from "../pages/index/components/Nav";

declare global {
	const React: typeof R;
	
	interface Window {
		NAV_DATA: Array<INavItem>;
	}
	
	interface Location {
		state: any;
	}
	
	interface nextUrl {
		asPath: string;
		
		back (): any;
		
		pathname: string;
		
		push (url: UrlLike, as: UrlLike, options: any): any;
		
		pushTo (url: UrlLike, as: UrlLike): any;
		
		query: any;
		
		replace (url: UrlLike, as: UrlLike): any;
	}
	
	type UploadState = "wait" | "uploading" | "complete" | "error";
}