import "./styles.scss";
import {
	Card,
	Icon,
	Badge,
	message,
} from "antd";
import {ArticleNetworkUtil} from "specUtils/article";
import {getNavPathById} from "specUtils/nav";
import {ellipsis} from "utils/string";
import {articleServerUrl} from "../../../../../config";
import {IArticleData} from "../../../containers/AddArticle";
import {
	Release,
	Editor,
	Preview,
	TopLevel,
	Delete,
} from "./actions";
import {Title} from "./Title";
import axios from "axios";

export interface IArticleCardData extends IArticleData {
	date: any;
	path?: string;
}

export interface IArticleCardProps {
	data: IArticleCardData;
	isSelected?: boolean;
	actions?: string[];
	canSelect?: boolean;
	
	onSelected? (isSelected: boolean, target: IArticleCardData): void;
	
	onDraftChange? (isDraft: boolean, target: IArticleCardData): void;
	
	onTopChange? (level: number, lastLevel: number, target: IArticleCardData): void;
	
	onPreviewClick? (target: IArticleCardData): void;
	
	onEditorClick? (target: IArticleCardData): void;
	
	onDelete? (target: IArticleCardData): void;
}

interface IArticleCardState {
	isDeleteConfirmVisible: boolean;
	isSelected: boolean;
}

export class ArticleCard extends React.Component<IArticleCardProps, IArticleCardState> {
	public static defaultProps = {
		actions: ["release", "top", "editor", "preview", "delete"],
		canSelect: true,
		isSelected: false,
	};
	
	public state = {
		isDeleteConfirmVisible: false,
		isSelected: this.props.isSelected,
	};
	
	public componentWillReceiveProps (nextProps) {
		this.state.isSelected = nextProps.isSelected;
	}
	
	public render () {
		const {data, actions, canSelect, isSelected} = this.props;
		const {
			      cover,
			      title,
			      date,
			      topLevel,
			      areaId,
		      } = data;
		const Actions = {
			release: <Release state={this.props.data.isDraft ? "draft" : "release"} onClick={this.handleDraftChange}/>,
			top: <TopLevel defaultValue={topLevel} onChange={this.handleTopChange}/>,
			preview: <Preview onClick={this.handlePreviewClick}/>,
			editor: <Editor onClick={this.handleEditorClick}/>,
			"delete": <Delete
				visible={this.state.isDeleteConfirmVisible}
				onConfirm={this.handleDelete}
				onCancel={this.toggleDeleteConfirm}
				onClick={this.toggleDeleteConfirm}
			/>,
		};
		
		return (
			<div
				className="admin-article-card"
				onClick={canSelect && typeof isSelected !== "undefined" ? this.toggleSelected : null}
			>
				{isSelected
				&&
				<div className="selected">
					<Icon className="icon" type="check"/>
				</div>}
				<Card
					hoverable
					cover={cover ? <img src={cover}/> : null}
					title={
						<Title
							title={title}
							date={date}
							path={typeof window !== "undefined" ? getNavPathById(areaId, window.NAV_DATA) : null}
						/>
					}
					actions={actions.map(action => Actions[action])}
					extra={
						!!topLevel
						&&
						<Badge
							className="top-tag"
							count={topLevel === 1 ? "重要事件" : "纪事报"}
						/>
					}
				>
					{/*内容片段*/}
					<div className="content-fragment">
						{!!ArticleCard.tempEl && this.getTextContent()}
					</div>
				</Card>
			</div>
		);
	}
	
	private updateData = (data) => {
		return ArticleNetworkUtil
			.updateArticle(data)
			.then(({code, msg}) => {
				if (code === 0) {
					message.success(msg);
				} else {
					message.error(msg);
				}
			})
			.catch(err => {
				message.error("网络异常");
			});
	};
	
	private handleTopChange = (level) => {
		const {onTopChange, data} = this.props;
		const lastLevel = data.topLevel;
		data.topLevel = level;
		this
			.updateData(data)
			.then(() => {
				this.forceUpdate();
				onTopChange && onTopChange(data.topLevel, lastLevel, data);
			});
	};
	
	private handleDraftChange = () => {
		const {onDraftChange, data} = this.props;
		data.isDraft = !data.isDraft;
		this
			.updateData(data)
			.then(() => {
				this.forceUpdate();
				onDraftChange && onDraftChange(data.isDraft, data);
			});
	};
	
	private toggleDeleteConfirm = () => {
		this.setState(prevState => ({
			isDeleteConfirmVisible: !prevState.isDeleteConfirmVisible,
		}));
	};
	
	private handlePreviewClick = () => {
		const {onPreviewClick, data} = this.props;
		onPreviewClick && onPreviewClick(data);
	};
	
	private handleEditorClick = () => {
		const {onEditorClick, data} = this.props;
		onEditorClick && onEditorClick(data);
	};
	
	private handleDelete = () => {
		const {onDelete, data} = this.props;
		ArticleNetworkUtil
			.deleteArticle(data.id)
			.then(({code, msg}) => {
				if (code === 0) {
					message.success(msg);
				} else {
					message.error(msg);
				}
				onDelete && onDelete(data);
			})
			.catch(err => message.error("网络异常"));
		this.toggleDeleteConfirm();
	};
	
	private toggleSelected = () => {
		const {onSelected, data} = this.props;
		this.setState(prevState => ({isSelected: !prevState.isSelected}), () => {
			if (onSelected) {
				onSelected(this.state.isSelected, data);
			}
		});
	};
	
	private static tempEl = typeof document !== "undefined" ? document.createElement("div") : null;
	
	// 获取过滤掉html的内容
	private getTextContent = () => {
		ArticleCard.tempEl.innerHTML = this.props.data.content;
		return ellipsis(ArticleCard.tempEl.textContent, 100);
	};
}