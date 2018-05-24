import "./styles.scss";
import {ArticleNetworkUtil} from "specUtils/article";
import {TabNetworkUtil} from "specUtils/tab";
import {guid} from "utils/crypto";
import {tabColumnServerUrl} from "../../../../config";
import {ArticleConnector} from "../../components/ArticleConnector";
import {IArticleCardProps} from "../../components/Card/Article";
import {ITabColumnsItemData, Tab} from "./Tab";
import {Button, message} from "antd";
import axios from "axios";

type ITabColumnsTabItem = {
	tabName: string;
	items: Array<ITabColumnsItemData>;
}

interface ITabColumnsProps {
	maxTab?: number;
}

interface ITabColumnsState {
	tabs: Array<ITabColumnsTabItem>
	isConnectorVisible: boolean;
	articles: Array<IArticleCardProps>;
	currentPage: number;
	pageSize: number;
	total: number;
	uploadState: UploadState;
}

export class TabColumns extends React.Component<ITabColumnsProps, ITabColumnsState> {
	public static defaultProps = {
		maxTab: 4,
	};
	
	public state = {
		tabs: [],
		isConnectorVisible: false,
		articles: [],
		currentPage: 1,
		pageSize: 9,
		total: 0,
		uploadState: "wait" as UploadState,
	};
	
	public render () {
		const {maxTab} = this.props;
		const {
			      tabs,
			      isConnectorVisible,
			      articles,
			      currentPage,
			      total,
			      pageSize,
		      } = this.state;
		return (
			<div className="admin-tab-columns">
				<div className="tab-wrapper">
					{tabs.map((data, i) => (
						<div key={guid()} style={{position: "relative"}}>
							<Tab
								data={data}
								onProfileClick={this.handleProfileClick}
							/>
							<Button
								onClick={this.removeTab}
								className="remove-tab"
								shape="circle"
								type="danger"
								icon="delete"
								data-index={i}
							/>
						</div>
					))}
					<Button type="primary" className="save" onClick={this.handleSave}>
						保存
					</Button>
					{tabs.length < maxTab
					&&
					<Button className="add-tab" onClick={this.addTab}>
						添加新标签
					</Button>}
				</div>
				<ArticleConnector
					dataList={articles}
					onCancel={this.toggleConnector}
					visible={isConnectorVisible}
					onOk={this.handleConnected}
					mode={"sign"}
					pagination={{
						current: currentPage,
						total,
						pageSize,
						onChange: this.handlePageChange,
					}}
				/>
			</div>
		);
	}
	
	public componentDidMount () {
		const {currentPage, pageSize} = this.state;
		TabNetworkUtil
			.getTab()
			.then(({code, msg, data}) => {
				if (code === 0) {
					this.setState({tabs: data});
					message.success("获取特色栏目成功");
				} else {
					message.error(msg);
				}
			})
			.catch(err => {
				message.error("网络异常,获取特色栏目失败");
			});
		ArticleNetworkUtil
			.requestArticles({
				topage: currentPage,
				max: pageSize,
				isDraft: false,
			})
			.then(({count, data}) => {
				this.setState({
					articles: data.map(data => ({
						data,
						isSelected: false,
					})),
					total: count,
				})
			});
	}
	
	private handlePageChange = (page) => {
		this.setState({currentPage: page});
	};
	
	private handleSave = () => {
		const {tabs} = this.state;
		
		if (!tabs.length) {
			message.error("请添加栏目");
			return;
		}
		
		if (tabs.some(tab => {
			const noItems = !tab.items.length;
			if (noItems) {
				message.error("标签必须含有子项");
			} else {
				if (tab.items.some(item => {
					const noArticle = !item.id;
					if (noArticle) {
						message.error("子项没有连接文章,请检查带有红色边框的子项");
					}
					return noArticle;
				})) {
					return true;
				}
			}
			return noItems;
		})) {
			return;
		}
		
		axios
			.post(`${tabColumnServerUrl}/PostUpTab`, tabs)
			.then(res => {
				const {code, msg} = res.data;
				if (code === 0) {
					message.success(msg);
				} else {
					message.error(msg);
				}
			})
			.catch(err => {
				message.error("网络异常,请检查网络后重试");
			});
	};
	
	private addTab = () => {
		this.state.tabs.push({
			tabName: "测试tab",
			items: [],
		});
		this.forceUpdate();
	};
	
	private removeTab = (e: React.MouseEvent<HTMLElement>) => {
		const index = +e.currentTarget.dataset.index;
		this.setState({
			tabs: this.state.tabs.filter((_, i) => i !== index),
		});
	};
	
	private handleConnected = (target) => {
		this.currentData.id = target.id;
		this.currentData.cover = target.cover;
		this.toggleConnector();
	};
	
	private handleProfileClick = (target) => {
		this.currentData = target;
		this.state.articles.forEach(article => {
			article.isSelected = target.id === article.data.id;
		});
		this.toggleConnector();
	};
	
	private toggleConnector = () => {
		this.setState(prevState => {
			return {
				isConnectorVisible: !prevState.isConnectorVisible,
			};
		});
	};
	
	private currentData;
}