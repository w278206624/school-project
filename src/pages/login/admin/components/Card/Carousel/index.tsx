import "./styles.scss";
import {Card, Icon, Upload, Input, Tooltip, message} from "antd";
import {UploadFile} from "antd/lib/upload/interface";
import {ArticleNetworkUtil} from "specUtils/article";
import {Preview} from "../../";
import {ArticleConnector} from "../../ArticleConnector";

export interface ICarouselCardProps {
	data: {
		src: string;
		desc?: string;
		articleId?: string | number;
	}
	
	onRemove? (e: React.MouseEvent<HTMLElement>): void;
	
	onConnected? (id: string | number): void
	
	onDescChange? (value: string): void;
	
	onBeforeUpload? (file: UploadFile, fileList: Array<UploadFile>): boolean | Promise<any>;
}

interface ICarouselCardState {
	data: ICarouselCardProps,
	disableModifyDesc: boolean;
	isPreview: boolean;
	isArticleConnectorVisible: boolean;
	currentPage: number;
	total: number;
	articles: any[];
}

const {Meta} = Card;

export default class extends React.Component<ICarouselCardProps, ICarouselCardState> {
	public state = {
		data: this.props,
		disableModifyDesc: true,
		isPreview: false,
		isArticleConnectorVisible: false,
		currentPage: 1,
		total: 0,
		articles: [],
	};
	
	public enableModifyDesc = () => this.setState({disableModifyDesc: false});
	
	public disableModifyDesc = () => this.setState({disableModifyDesc: true});
	
	private togglePreview = () => {
		this.setState((prevState) => {
			return {
				isPreview: !prevState.isPreview,
			};
		});
	};
	
	private handleConnected = (target) => {
		const {onConnected, data} = this.props;
		data.articleId = target.id;
		this.toggleArticleConnector();
		onConnected && onConnected(target.id);
	};
	
	private handleChange = (e) => {
		this.props.data.desc = e.target.value;
	};
	
	private handleProfileClick = () => {
		this.setState({
			total: 0,
			currentPage: 1,
		});
		this.getArticles(1);
		this.toggleArticleConnector();
	};
	
	private getArticles = (currentPage: number) => {
		ArticleNetworkUtil
			.requestArticles({
				topage: currentPage,
				max: 9,
				isDraft: false,
			})
			.then(({code, msg, data, count}) => {
				if (code === 0) {
					this.setState({
						articles: data.map(data => ({
							data,
							isSelected: data.id === this.props.data.articleId,
						})),
						total: count,
					});
				} else {
					message.error(msg);
				}
			})
			.catch(err => console.log(err));
	};
	
	private handlePageChange = (page) => {
		this.setState({currentPage: page});
		this.getArticles(page);
	};
	
	private toggleArticleConnector = () => {
		this.setState(prevState => ({
			isArticleConnectorVisible: !prevState.isArticleConnectorVisible,
		}));
	};
	
	public render () {
		const {data, onBeforeUpload, onRemove} = this.props;
		const {
			      disableModifyDesc,
			      isPreview,
			      isArticleConnectorVisible,
			      currentPage,
			      total,
			      articles,
		      } = this.state;
		const {src, desc} = data;
		return (
			<div>
				<Card
					hoverable
					cover={
						<div onClick={this.togglePreview}>
							<Tooltip
								title="点击可预览大图"
								mouseEnterDelay={1}
							>
								<img className="carousel-card-img" src={src} alt={desc}/>
							</Tooltip>
						</div>
					}
					actions={[
						<Tooltip title="选择文章">
							<Icon type="profile" onClick={this.handleProfileClick}/>
						</Tooltip>,
						<Tooltip title="点击可上传图片哦">
							<div>
								<Upload
									className="upload"
									beforeUpload={onBeforeUpload}
									accept="image/*"
									listType="picture-card"
									showUploadList={false}
								>
									<Icon type="upload"/>
								</Upload>
							</div>
						</Tooltip>
						,
						<Tooltip title="移除图片">
							<Icon onClick={onRemove} type="close"/>
						</Tooltip>,
					]}
				>
					<Meta
						description={
							<Tooltip
								title="双击可编辑内容"
								mouseEnterDelay={1}
								overlayClassName={disableModifyDesc ? null : "hidden"}
							>
								<div
									onBlur={this.disableModifyDesc}
									onDoubleClick={this.enableModifyDesc}
								>
									<Input
										className={disableModifyDesc ? "carousel-card-desc-disable" : null}
										onPressEnter={this.disableModifyDesc}
										onChange={this.handleChange}
										defaultValue={desc}
										disabled={disableModifyDesc}
										placeholder="可输入标题"
									/>
								</div>
							</Tooltip>
						}
					/>
				</Card>
				<Preview
					visible={isPreview}
					width="auto"
					style={{
						margin: "100px",
					}}
					onCancel={this.togglePreview}
				>
					<img src={src} alt={desc}/>
				</Preview>
				<ArticleConnector
					mode="sign"
					dataList={articles}
					visible={isArticleConnectorVisible}
					onOk={this.handleConnected}
					onCancel={this.toggleArticleConnector}
					pagination={{
						current: currentPage,
						total,
						onChange: this.handlePageChange,
					}}
				/>
			</div>
		);
	}
}
