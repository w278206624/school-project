import {isString} from "util";

export type ILinkTo = string | {
	pathname: string;
	state?: { [key: string]: any };
	query?: { [key: string]: any };
}

interface ILinkProps {
	to: ILinkTo;
	className?: string;
	style?: React.CSSProperties;
	disable?: boolean;
	
	[key: string]: any;
}

function encodeJson (target: { [key: string]: any }) {
	let result = "?";
	Object
		.keys(target)
		.forEach(key => {
			let value = target[key];
			if (typeof value === "object") {
				value = JSON.stringify(value);
			}
			result += `${key}=${value}&`
		});
	return result.slice(0, result.length - 1);
}

export class Link extends React.Component<ILinkProps> {
	private handleClick = () => {
		const {to} = this.props;
		if (!isString(to)) {
			location.state = to.state;
		}
	};
	
	public render () {
		const {to, children, disable, ...attach} = this.props;
		let path: string;
		
		if (isString(to)) {
			path = to;
			return (
				<a
					href={disable ? null : `#${path}`}
					onClick={disable ? null : this.handleClick}
					{...attach}
				>
					{children}
				</a>
			);
		} else {
			path = to.pathname;
			return (
				<a
					href={disable ? null : `#${path}${to.query ? encodeJson(to.query) : ""}`}
					onClick={disable ? null : this.handleClick}
					{...attach}
				>
					{children}
				</a>
			);
		}
	}
}