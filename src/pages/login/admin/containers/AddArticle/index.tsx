import {
	Cascader,
	Button,
	Icon,
	message,
	Input,
	Upload,
	Checkbox,
	Select,
} from "antd";
import {CascaderOptionType} from "antd/lib/cascader";
import {UploadFile} from "antd/lib/upload/interface";
import {ArticleNetworkUtil} from "specUtils/article";
import {Preview, BraftEditor} from "../../components/";

export class AddArticle extends React.Component<{}, IAddArticleState> {
	public state = {
		uploadState: "wait" as UploadState,
		isPreview: false,
		navOptions: [],
		hasError: false,
	};
	
	public data: IArticleData = {
		title: "",
		content: "",
		cover: "",
		areaId: null,
		id: null,
		topLevel: 0,
		isDraft: true,
	};
	
	public render () {
		const {uploadState, isPreview, navOptions} = this.state;
		return (
			<div>
				<Cascader
					style={{margin: "20px 0"}}
					placeholder="请选择发布区域"
					options={navOptions}
					onChange={this.handleSelectGroup}
					changeOnSelect
				/>
				<Upload
					style={{marginLeft: "10px"}}
					beforeUpload={this.handleSelectCover}
					showUploadList={false}
					accept="image/*"
					disabled={!this.data.id}
				>
					<Button>选择封面</Button>
				</Upload>
				<Input
					type="text"
					placeholder="文章标题"
					style={{marginBottom: "10px"}}
					onChange={this.handleTitleChange}
				/>
				<div style={{backgroundColor: "white"}}>
					<BraftEditor
						id={this.data.id}
						innerRef={(ref) => this.braftEditor = ref}
					/>
				</div>
				<div style={{marginTop: "20px"}}>
					<Button
						type="primary"
						onClick={this.startUpload}
						disabled={uploadState === "uploading" || !this.data.id}
					>
						{this.data.isDraft ? "保存至草稿箱" : "发布文章"}
						<Icon type="form"/>
					</Button>
					<Button
						onClick={this.togglePreview}
						style={{margin: "0 20px"}}
					>
						预览
						<Icon type="eye"/>
					</Button>
					<Checkbox
						defaultChecked
						onChange={this.handleDraftChange}
					>
						保存草稿箱
					</Checkbox>
					<Select defaultValue={0} onChange={this.handleTopChange}>
						<Option value={0}>默认</Option>
						<Option value={1}>重要事件</Option>
						<Option value={2}>纪事报</Option>
					</Select>
				</div>
				<Preview title={this.data.title} visible={isPreview} onCancel={this.togglePreview}>
					<div dangerouslySetInnerHTML={{__html: this.braftEditor ? this.braftEditor.getContent("html") : null}}/>
				</Preview>
			</div>
		);
	}
	
	private handleTopChange = (value) => {
		this.data.topLevel = value;
	};
	
	public componentDidMount () {
		const id = localStorage.getItem("willAddArticleId");
		
		if (id === null || id === "undefined") {
			this.requestID();
		} else {
			this.data.id = id;
		}
		
		this.setState({
			navOptions: window.NAV_DATA.map(data => this.createNavOptionData(data)),
		});
	}
	
	private requestID = () => {
		ArticleNetworkUtil
			.allocationId()
			.then(({data}) => {
				localStorage.setItem("willAddArticleId", data);
				this.data.id = data;
				this.forceUpdate();
			})
			.catch(err => {
				message.error("网络异常,请尝试刷新网页");
			});
	};
	
	private braftEditor;
	
	private hideLoading: Function;
	
	private startUpload = () => {
		if (this.state.hasError) {
			message.error("发布的区域必选大于等于二级");
			return;
		}
		
		if (!this.braftEditor) {
			message.error("编辑器初始化中");
			return;
		}
		
		this.data.content = this.braftEditor.getContent("html");
		const {
			      title,
			      areaId,
			      id,
		      } = this.data;
		
		if (!areaId) {
			message.error("请选择发布区域");
			return;
		}
		
		if (!title) {
			message.error("请输入标题");
			return;
		}
		
		if (!id) {
			message.error("网络异常,无法发布新闻,请尝试刷新网页后重试");
		}
		
		if (this.braftEditor.isEmpty()) {
			message.error("请输入内容");
			return;
		}
		
		this.hideLoading = message.loading("发布中", 0);
		
		ArticleNetworkUtil
			.updateArticle(this.data)
			.then(({code, msg}) => {
				if (code === 0) {
					localStorage.removeItem("willAddArticleId");
					this.hideLoading();
					this.braftEditor.clear();
					if (this.data.isDraft) {
						message.success("文章已保存至草稿箱");
					} else {
						message.success("发布成功");
					}
					this.requestID();
				} else {
					message.error(msg);
				}
			})
			.catch(err => {
				this.hideLoading();
				message.error("网络异常,无法保存");
			});
	};
	
	private handleSelectCover = (file: UploadFile) => {
		ArticleNetworkUtil
			.uploadImg(this.data.id, file)
			.then(({code, msg, data}) => {
				if (code === 0) {
					this.data.cover = data;
					message.success("添加封面成功");
				} else {
					message.error(msg);
				}
			})
			.catch(err => {
				message.error("网络异常");
			});
		return false;
	};
	
	private handleTitleChange = (e) => {
		this.data.title = e.currentTarget.value;
	};
	
	private handleSelectGroup = (value) => {
		this.state.hasError = value.length === 1;
		this.data.areaId = value[value.length - 1];
	};
	
	private togglePreview = () => {
		this.setState((prevState) => {
			return {
				isPreview: !prevState.isPreview,
			};
		})
	};
	
	private createNavOptionData = ({title, id, children}) => {
		return {
			label: title,
			value: id,
			children: children.length
				? children.map(data => this.createNavOptionData(data))
				: null,
		};
	};
	
	private handleDraftChange = (e) => {
		this.data.isDraft = e.target.checked;
		this.forceUpdate();
	};
}


const {Option} = Select;

interface IAddArticleState {
	uploadState: UploadState;
	isPreview: boolean;
	navOptions: Array<CascaderOptionType>;
	hasError: boolean;
}

export interface IArticleData {
	title: string;
	content: string;
	cover: string;
	areaId: string;
	id: string | number;
	isDraft: boolean;
	topLevel: number;
}