import * as React from "react";

interface IRouteProps {
	path: string;
}

export const Route: React.SFC<IRouteProps> = ({children}) => {
	const data = (typeof location !== "undefined" && location.state) || {};
	return (
		<React.Fragment>
			{React.cloneElement(children as React.ReactElement<HTMLElement>, {...data})}
		</React.Fragment>
	)
};
