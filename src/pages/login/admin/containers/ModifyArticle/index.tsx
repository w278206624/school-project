import {message} from "antd";
import {ArticleNetworkUtil} from "specUtils/article";
import {Articles} from "../../components";
import {IArticleCardProps} from "../../components/Card/Article";

interface IModifyArticleState {
	dataList: Array<IArticleCardProps>;
	sortMode: string;
	total: number;
	currentPage: number;
	pageSize: number;
}

export class ModifyArticle extends React.Component<{}, IModifyArticleState> {
	public state = {
		dataList: [],
		sortMode: "date",
		currentPage: 1,
		total: 0,
		pageSize: 9,
	};
	
	private hideLoading: Function;
	
	private fetchData = () => {
		const {sortMode, currentPage, pageSize} = this.state;
		this.hideLoading = message.loading("加载中", 0);
		ArticleNetworkUtil
			.requestArticles({
				isDraft: false,
				max: pageSize,
				topage: currentPage,
				Sortmode: sortMode,
			})
			.then(({
				       code,
				       msg,
				       data,
				       count,
			       }) => {
					if (code === 0) {
						message.success(msg);
						this.setState({
							dataList: data.map((data) => ({
								data,
								canSelect: false,
								onDelete: (target) => {
									this.setState({
										dataList: this.state.dataList.filter(item => item.data !== target),
									}, () => {
										this.fetchData();
									});
								},
								onDraftChange: () => {
									this.fetchData();
								},
							})),
							total: count,
						});
					} else {
						message.error(msg);
					}
					this.hideLoading();
				},
			)
			.catch(err => {
				message.error("网络异常");
				this.hideLoading();
			});
	};
	
	private handleSortModeChange = (value) => {
		this.setState({sortMode: value}, this.fetchData);
	};
	
	private handlePageChange = (page) => {
		this.setState({currentPage: page}, this.fetchData);
	};
	
	public render () {
		const {dataList, total} = this.state;
		return (
			<Articles
				dataList={dataList}
				onSortModeChange={this.handleSortModeChange}
				pagination={{
					total,
					onChange: this.handlePageChange,
				}}
			/>
		);
	}
	
	public componentDidMount () {
		this.fetchData();
	}
}
