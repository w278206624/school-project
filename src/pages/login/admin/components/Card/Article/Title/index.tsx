import "./styles.scss";
import {Tooltip} from "antd";
import moment from "moment";

interface IArticleCardTitleProps {
	title: string;
	date: any;
	path?: string;
}

export const Title: React.SFC<IArticleCardTitleProps> = ({
	                                                         title,
	                                                         date,
	                                                         path,
                                                         }) => (
	<div className="admin-article-card-title">
		<div className="info">
			{path
			&&
			<Tooltip title={path}>
				<div className="path">{path}</div>
			</Tooltip>}
			<div className={path ? "date" : null}>{moment(date).format("YYYY-MM-DD HH:mm:ss")}</div>
		</div>
		<Tooltip title={title}>
			<div className="title">
				{title}
			</div>
		</Tooltip>
	</div>
);