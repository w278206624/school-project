import "./styles.scss";
import {Button, message} from "antd";
import {ArticleNetworkUtil} from "specUtils/article";
import {NavNetworkUtil} from "specUtils/nav";
import {remove} from "utils/array";
import {guid} from "utils/crypto";
import {ArticleConnector} from "../ArticleConnector";
import {Container, containerConfig} from "./Container";
import {Item} from "./Item";
import {Setting} from "./Setting";
import {arrayMove} from "react-sortable-hoc";


interface INavProps {
	navList: any[];
	maxItem?: number;
	maxLevel?: number;
	
	onConnected? (targetId: string, ids: string[]): void;
	
	onDelete? (ids: string[]): void;
	
	onSave? (navList: any[]): void;
}

interface INavState {
	isArticleConnectorVisible: boolean;
	isSettingVisible: boolean;
	navList: any[];
	title: string;
	articleList: any[];
	currentPage: number;
	total: number;
	sortMode: string;
}

export class Nav extends React.PureComponent<INavProps, INavState> {
	public static defaultProps = {
		maxLevel: 3,
		maxItem: 9,
		navList: [],
	};
	
	public state = {
		isArticleConnectorVisible: false,
		isSettingVisible: false,
		navList: this.props.navList,
		title: "",
		articleList: [],
		total: 0,
		currentPage: 1,
		sortMode: "date",
	};
	
	private currentNav;
	
	private handleArticleConnectorClick = (target) => {
		const {currentPage} = this.state;
		this.currentNav = target;
		this.setState({
			currentPage: 1,
			total: 0,
			articleList: [],
		});
		this.toggleArticleConnectorVisible();
		ArticleNetworkUtil
			.requestArticles({
				isDraft: false,
				topage: currentPage,
				max: 9,
				AreaIds: [target.id, "0"].join(","),
			})
			.then(({code, msg, data, count}) => {
				if (code === 0) {
					this.setState({
						articleList: data.map(data => ({
							data,
							isSelected: data.areaId === target.id,
						})),
						total: count,
					});
				}
			});
	};
	
	private handleConnectOk = (dataList) => {
		this.toggleArticleConnectorVisible();
		NavNetworkUtil
			.linkArticles(this.currentNav.id, dataList.map(data => data.id))
			.then(({code, msg}) => {
				if (code === 0) {
					message.success(msg);
				} else {
					message.error(msg)
				}
			})
			.catch(err => console.log(err));
	};
	
	public render () {
		const {maxItem, maxLevel} = this.props;
		const {
			      isArticleConnectorVisible,
			      isSettingVisible,
			      title,
			      navList,
			      articleList,
			      total,
			      currentPage,
			      sortMode,
		      } = this.state;
		return (
			<React.Fragment>
				<Container
					{...containerConfig}
					onSortEnd={this.handleSortEnd}
				>
					{navList.map((data, i) => (
						<Item
							index={i}
							key={data.id}
							data={data}
							order={i}
							maxLevel={maxLevel}
							onConnectedClick={this.handleArticleConnectorClick}
							onSettingClick={this.handleSettingClick}
							onDelete={this.handleDelete}
						/>
					))}
				</Container>
				<div>
					<Button
						className="admin-nav-save"
						type="primary"
						onClick={this.handleSave}
					>
						保存
					</Button>
					<Button
						disabled={navList.length >= maxItem}
						onClick={this.handleAddItem}
					>
						添加新导航栏
					</Button>
				</div>
				<Setting
					onCancel={this.toggleSettingVisible}
					onModify={this.handleSettingOk}
					visible={isSettingVisible}
					title={title}
				/>
				<ArticleConnector
					dataList={articleList}
					onOk={this.handleConnectOk}
					onCancel={this.toggleArticleConnectorVisible}
					visible={isArticleConnectorVisible}
					pagination={{
						total,
						current: currentPage,
						onChange: this.handlePageChange,
					}}
				/>
			</React.Fragment>
		);
	}
	
	private handlePageChange = (page) => {
		this.setState({
			currentPage: page,
		});
		ArticleNetworkUtil
			.requestArticles({
				isDraft: false,
				topage: page,
				max: 9,
				AreaIds: [this.currentNav.id, "0"].join(","),
			})
			.then(({code, msg, data, count}) => {
				if (code === 0) {
					this.setState({
						articleList: data.map(data => ({
							data,
							isSelected: data.areaId === this.currentNav.id,
						})),
						total: count,
					});
				}
			});
	};
	
	private handleDelete = (ids, target) => {
		const {onDelete} = this.props;
		this.deleteItem(this.state.navList, target);
		onDelete && onDelete(ids);
		this.forceUpdate();
	};
	
	private deleteItem = (list, target) => {
		const index = list.indexOf(target);
		if (index !== -1) {
			list.splice(index, 1);
		} else {
			list.forEach(item => this.deleteItem(item.children, target));
		}
	};
	
	private handleSave = () => {
		const {onSave} = this.props;
		const {navList} = this.state;
		window.NAV_DATA = navList;
		onSave && onSave(navList);
	};
	
	private handleAddItem = () => {
		this.setState(prevState => ({
			navList: prevState.navList.concat({
				title: "新栏目",
				id: guid(),
				children: [],
			}),
		}))
	};
	
	private currentData;
	
	private handleSettingClick = (data) => {
		this.setState({title: data.title});
		this.toggleSettingVisible();
		this.currentData = data;
	};
	
	private handleSettingOk = (title) => {
		this.currentData.title = title;
		this.toggleSettingVisible();
	};
	
	private toggleArticleConnectorVisible = () => {
		this.setState((prevState) => {
			return {isArticleConnectorVisible: !prevState.isArticleConnectorVisible};
		});
	};
	
	private toggleSettingVisible = () => {
		this.setState((prevState) => {
			return {isSettingVisible: !prevState.isSettingVisible};
		});
	};
	
	private handleSortEnd = ({oldIndex, newIndex}) => {
		this.setState({
			navList: arrayMove(this.state.navList, oldIndex, newIndex),
		});
	}
}