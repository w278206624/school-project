import {ArticleCard} from "../";
import {IArticleCardProps} from "../Card/Article";

interface IArticlesItemProps {
	data: IArticleCardProps;
}

export class Item extends React.Component<IArticlesItemProps> {
	public render () {
		const {data} = this.props;
		return (
			<div className="item">
				<ArticleCard {...data}/>
			</div>
		)
	}
}