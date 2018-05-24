import "./styles.scss";
import {Pagination, message, Icon} from "antd";
import {PaginationProps} from "antd/lib/pagination";
import {ArticleNetworkUtil} from "specUtils/article";
import {IArticleCardProps} from "../Card/Article";
import {SortModeSelect} from "./SortModeSelect";
import {Editor} from "./Editor";
import {Preview} from "./Preview";
import Masonry from "react-masonry-component";
import {ArticleCard} from "../Card/Article";

export class Articles extends React.Component<IArticlesProps, IArticlesState> {
	public static defaultProps = {
		sortModes: ["date", "top"],
		defaultSortMode: "date",
	};
	
	public state = {
		isEditorVisible: false,
		isPreviewVisible: false,
	};
	
	private handleSortModeChange = (value) => {
		const {onSortModeChange} = this.props;
		this.lock = false;
		onSortModeChange && onSortModeChange(value);
	};
	
	private masonry;
	
	private lock = false;
	
	public render () {
		const {
			      dataList,
			      pagination,
			      sortModes,
		      } = this.props;
		const {
			      isEditorVisible,
			      isPreviewVisible,
		      } = this.state;
		return (
			<div className="admin-articles">
				<SortModeSelect
					defaultValue={this.props.defaultSortMode}
					onChange={this.handleSortModeChange}
					modes={sortModes}
				/>
				{dataList.length
					? (
						<Masonry
							className="list"
							options={{
								gutter: 24,
								horizontalOrder: true,
								percentPosition: true,
								itemSelector: ".item",
								columnWidth: ".item",
							}}
							onLayoutComplete={this.handleLayoutComplete}
							ref={(ref) => this.masonry = ref}
						>
							{dataList.map((data) => (
								<div className="item" key={data.data.id}>
									<ArticleCard
										{...data}
										onPreviewClick={this.handlePreviewClick}
										onEditorClick={this.handleEditorClick}
									/>
								</div>
							))}
						</Masonry>
					)
					: (
						<div className="no-data">
							<p className="text"> 暂时没有数据,正在等待您发布的信息</p>
							<Icon type="message" className="icon"/>
						</div>
					)}
				<Pagination className="page-controller" {...pagination}/>
				<Editor
					onConfirm={this.handleEditorConfirm}
					onCancel={this.toggleEditor}
					data={this.currentData}
					visible={isEditorVisible}
				/>
				<Preview
					onCancel={this.togglePreview}
					title={this.currentData.title}
					content={this.currentData.content}
					visible={isPreviewVisible}
				/>
			</div>
		)
	}
	
	private currentData: any = {
		title: "",
		content: "",
	};
	
	private handleLayoutComplete = () => {
		if (!this.lock && this.masonry) {
			this.lock = true;
			this.masonry.masonry.layout();
		}
	};
	
	private handlePreviewClick = (target) => {
		ArticleNetworkUtil
			.requestArticle(target.id)
			.then(({data}) => {
				this.currentData = data;
				this.togglePreview();
			})
			.catch(err => {
				message.error("网络异常,获取文章详情失败");
			});
	};
	
	private handleEditorClick = (target) => {
		ArticleNetworkUtil
			.requestArticle(target.id)
			.then(({data}) => {
				this.currentData = data;
				this.toggleEditor();
			})
			.catch(err => {
				message.error("网络异常,获取文章详情失败");
			});
	};
	
	private toggleEditor = () => {
		this.setState(prevState => ({
			isEditorVisible: !prevState.isEditorVisible,
		}));
	};
	
	private togglePreview = () => {
		this.setState(prevState => ({
			isPreviewVisible: !prevState.isPreviewVisible,
		}));
	};
	
	private handleEditorConfirm = () => {
		this.props.dataList.forEach(({data}, i) => {
			if (data.id === this.currentData.id) {
				this.props.dataList[i].data = this.currentData;
			}
		});
		this.toggleEditor();
	}
}

type ISortMode = "date" | "top" | "part";

export interface IArticlesProps {
	dataList: Array<IArticleCardProps>;
	
	pagination?: PaginationProps;
	
	sortModes?: Array<ISortMode>;
	
	defaultSortMode?: ISortMode;
	
	onSortModeChange? (mode: ISortMode): void;
}

interface IArticlesState {
	isEditorVisible: boolean;
	isPreviewVisible: boolean;
}