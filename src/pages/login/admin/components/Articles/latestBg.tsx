import "./styles.scss";
import {Pagination, Card, message} from "antd";
import {PaginationProps} from "antd/lib/pagination";
import {findNavById} from "specUtils/nav";
import {flatten} from "utils/array";
import {IArticleData} from "../../containers/AddArticle";
import {ArticleCard} from "../Card";
import {IArticleCardProps} from "../Card/Article";
import {articleServerUrl} from "../../../../config";
import axios from "axios"
import {SortModeSelect} from "./SortModeSelect";
import {PartSelect} from "./PartSelect";
import {Editor} from "./Editor";
import {Preview} from "./Preview";
import Masonry from "react-masonry-component";

const msgHookForLevel = ["已取消置顶", "置顶成功", "强制置顶成功"];

// 最新备份
export class ModifyArticle extends React.Component<IModifyArticleProps, IModifyArticleState> {
	public static defaultProps = {
		pageSize: 9,
		defaultSortMode: "date",
		navList: [],
		path: "",
		canSelect: false,
		defaultConnects: [],
		isDraft: false,
	};
	
	public state = {
		dataList: [],
		total: 0,
		currentPage: 1,
		sortMode: this.props.defaultSortMode,
		parts: [],
		isEditorVisible: false,
		isPreviewVisible: false,
	};
	
	public componentWillReceiveProps (nextProps) {
		this.fetchData(nextProps);
	}
	
	public render () {
		const {
			      pageSize,
			      navList,
			      areaId,
			      actions,
			      onSelected,
			      canSelect,
			      defaultConnects,
		      } = this.props;
		const {
			      dataList,
			      total,
			      currentPage,
			      sortMode,
			      parts,
			      isEditorVisible,
			      isPreviewVisible,
		      } = this.state;
		const sortModes = ["date", "top"];
		!!navList.length && sortModes.push("part");
		return (
			<div className="admin-articles">
				<SortModeSelect
					defaultValue={sortMode}
					onChange={this.handleSortChange}
					modes={sortModes}
				/>
				{sortMode !== "part" || !navList.length
					? (
						<React.Fragment>
							<Masonry
								className="list"
								options={{
									gutter: 24,
									horizontalOrder: true,
									percentPosition: true,
									itemSelector: ".item",
								}}
							>
								{dataList.map((data) => {
									if (data.areaId === areaId
										|| !areaId
										|| findNavById(data.areaId, navList)) {
										return (
											<div
												className="item"
												key={data.id}
											>
												<ArticleCard
													onEditorClick={this.handleEditorClick}
													onDelete={this.handleDelete}
													onPreviewClick={this.handlePreviewClick}
													onDraftChange={this.handleDraftChange}
													onTopChange={this.handleTopChange}
													data={data}
													actions={actions}
													canSelect={canSelect}
													onSelected={onSelected}
													isSelected={defaultConnects.indexOf(data.id) !== -1}
												/>
											</div>
										);
									}
								})}
							</Masonry>
							<Pagination
								style={{textAlign: "center"}}
								current={currentPage}
								total={total}
								onChange={this.handlePageChange}
								pageSize={pageSize}
							/>
						</React.Fragment>
					)
					: (
						<React.Fragment>
							<PartSelect
								defaultValue={parts}
								onChange={this.handlePartChange}
								navList={navList}
							/>
							{parts.map(id => {
								let nav;
								for (let i = 0, len = navList.length; i < len; i++) {
									if (navList[i].id === id) {
										nav = navList[i];
										break;
									}
								}
								
								return (
									<Card
										className="part"
										title={nav.title}
										key={nav.id}
									>
										<ModifyArticle
											{...this.props}
											navList={nav.children}
											areaId={nav.id}
										/>
									</Card>
								);
							})}
						</React.Fragment>
					)}
				<Editor
					onConfirm={this.toggleEditor}
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
	
	public componentDidMount () {
		this.fetchData();
	}
	
	private hideLoading: Function;
	
	private currentData = {
		title: "",
		content: "",
	};
	
	private handleDelete = (target) => {
		const {dataList} = this.state;
		const index = dataList.indexOf(target);
		if (index !== -1) {
			this.hideLoading = message.loading("删除中", 0);
			axios
				.delete(`${articleServerUrl}/deleteArticle?id=${target.id}`)
				.then(res => {
					dataList.splice(dataList.indexOf(target), 1);
					message.success(res.data.msg);
					this.hideLoading();
					this.fetchData();
				})
				.catch(err => {
					if (err.response) {
						message.error(err.response.data.msg || "删除失败");
					} else {
						message.error("网络异常");
					}
					this.hideLoading();
				});
		}
	};
	
	private handleDraftChange = (isDraft, target) => {
		axios
			.put(`${articleServerUrl}/updateArticle`, target)
			.then(res => {
				message.success(isDraft ? "已存入草稿箱" : "发布成功");
				this.fetchData();
			})
			.catch(err => {
				if (err.reponse) {
					message.error(err.reponse.data.msg);
				} else {
					message.error("网络异常");
				}
			});
	};
	
	private handleTopChange = (level, lastLevel, target) => {
		axios
			.put(`${articleServerUrl}/updateArticle`, target)
			.then(res => {
				message.success(msgHookForLevel[level]);
				this.forceUpdate();
			})
			.catch(err => {
				if (err.reponse) {
					message.error(err.reponse.data.msg);
				} else {
					message.error("网络异常");
				}
				target.topLevel = lastLevel;
			});
	};
	
	private handlePreviewClick = (target) => {
		this.currentData = target;
		this.togglePreview();
	};
	
	private handleEditorClick = (data) => {
		this.currentData = data;
		this.toggleEditor();
	};
	
	private handlePartChange = (parts: string[]) => {
		this.setState({parts});
	};
	
	private handleSortChange = (value: ISortMode) => {
		this.setState({sortMode: value}, this.fetchData);
	};
	
	private handlePageChange = (page: number) => {
		this.setState({currentPage: page}, this.fetchData);
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
	
	private fetchData = (props = this.props, status = this.state) => {
		const {pageSize, areaId, navList, isDraft} = props;
		const {currentPage, sortMode} = status;
		
		function getId (navList: Array<any>) {
			return navList.map(nav => {
				if (nav.children.length) {
					return [nav.id].concat(getId(nav.children));
				} else {
					return nav.id;
				}
			});
		}
		
		const ids = sortMode === "part"
			? JSON.stringify(flatten(getId(navList).concat(areaId)).filter(v => !!v))
			: "";
		
		const params = {
			toPage: currentPage,
			max: pageSize,
			isDraft,
			Sortmode: sortMode,
		};
		
		if (ids) {
			(params as any).AreaIds = ids;
		}
		
		axios
			.get(`${articleServerUrl}/GetNews`, {
				params,
				timeout: 5000,
			})
			.then(res => {
				const {count, data} = res.data;
				this.setState({
					dataList: data.map(({
						                    Title,
						                    Content,
						                    ID,
						                    AreaId,
						                    isDraft,
						                    TopLevel,
						                    ImgPath,
					                    }) => ({
						title: Title,
						content: Content,
						id: ID,
						areaId: AreaId,
						isDraft,
						topLevel: TopLevel,
						cover: ImgPath,
					})),
					total: count,
				});
			})
			.catch(err => {
				if (err.response) {
					message.error(err.response.data.msg || "获取文章失败");
				} else {
					message.error("网络异常");
				}
			});
	};
}

type ISortMode = "date" | "top" | "part";

interface IModifyArticleProps {
	pageSize?: number;
	defaultSortMode?: ISortMode;
	areaId?: string;
	navList?: Array<any>;
	path?: string;
	actions?: string[];
	canSelect?: boolean;
	defaultConnects?: Array<string | number>;
	isDraft?: boolean;
	
	onSelected? (isSelect: boolean, target: IArticleData): void;
}

interface IModifyArticleState {
	dataList: Array<IArticleCardProps>;
	total: number;
	currentPage: number;
	sortMode: ISortMode;
	parts: string[];
	isEditorVisible: boolean;
	isPreviewVisible: boolean;
}