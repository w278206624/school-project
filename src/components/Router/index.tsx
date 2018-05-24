import * as React from "react";
import * as ReactCSSTransitionGroup from "react-addons-css-transition-group";

interface IRouterProps extends React.CSSTransitionGroupProps {
	transitionName?: string;
	
	onRouteChange? (path: string): void;
}

export class Router extends React.Component<IRouterProps> {
	public state = {
		hash: "",
	};
	
	public shouldComponentUpdate (nextProps, nextState) {
		const {hash} = this.state;
		return nextState.hash !== hash;
	}
	
	public render () {
		return this.props.transitionName
			? (
				<ReactCSSTransitionGroup {...this.props as any}>
					{this.getChildren()}
				</ReactCSSTransitionGroup>
			)
			: this.getChildren();
	}
	
	public componentDidMount () {
		this.fireEvents();
		this.updateHash();
		window.addEventListener("hashchange", this.updateHash);
	}
	
	public componentWillUnmount () {
		window.removeEventListener("hashchange", this.updateHash);
	}
	
	private static getPath (hash: string) {
		const queryIndex = hash.indexOf("?");
		let path = "/";
		if (queryIndex !== -1) {
			path = hash.slice(1, queryIndex);
		} else if (hash) {
			path = hash.slice(1);
		}
		return path;
	}
	
	private fireEvents = () => {
		const {hash} = this.state;
		const {onRouteChange} = this.props;
		
		if (onRouteChange) {
			onRouteChange(Router.getPath(hash));
		}
	};
	
	private updateHash = () => {
		this.setState({hash: location.hash})
	};
	
	private eqHash = (path: string) => {
		const currentPath = Router.getPath(this.state.hash);
		return path === currentPath;
	};
	
	private getChildren () {
		const children = React.Children.toArray(this.props.children);
		return children.filter((child: any) => this.eqHash(child.props.path));
	}
}

export {Route} from "./Route";
export {Link} from "./Link";