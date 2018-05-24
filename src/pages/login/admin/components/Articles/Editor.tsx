import {UploadFile} from "antd/lib/upload/interface";
import axios from "axios";
import {ArticleNetworkUtil} from "specUtils/article";
import {articleServerUrl} from "../../../../config";
import {Preview} from "../Preview";
import {Input, Upload, Button, message} from "antd";
import {BraftEditor} from "../BraftEditor";

interface IArticlesEditorProps {
	data: any;
	visible?: boolean;
	
	onConfirm? (): void;
	
	onCancel? (): void;
}

export class Editor extends React.Component<IArticlesEditorProps> {
	public state = {
		title: this.props.data.title,
	};
	
	public componentWillReceiveProps (nextProps) {
		this.state.title = nextProps.data.title;
	}
	
	public render () {
		const {
			      data,
			      visible,
			      onCancel,
		      } = this.props;
		const {id, content} = data;
		const {title} = this.state;
		
		return (
			<Preview
				visible={visible}
				onCancel={onCancel}
				title={
					<React.Fragment>
						<div>
							<Input
								value={title}
								onChange={this.handleTitleChange}
								className="admin-articles-editor-title"
							/>
							<Upload
								beforeUpload={this.handleSelectCover}
								showUploadList={false}
								accept="image/*"
							>
								<Button className="admin-articles-editor-upload-cover">选择封面</Button>
							</Upload>
						</div>
					</React.Fragment>
				}
			>
				<BraftEditor
					innerRef={(ref) => this.braftEditor = ref}
					id={id}
					contentId={id}
					initialContent={content}
					contentFormat="html"
					pasteMode="text"
				/>
				<Button
					type="primary"
					className="admin-articles-editor-ok"
					onClick={this.handleConfirm}
				>
					确认修改
				</Button>
				<Button onClick={onCancel}>取消</Button>
			</Preview>
		)
	}
	
	private handleConfirm = () => {
		const {onConfirm, data} = this.props;
		data.title = this.state.title;
		data.content = this.braftEditor.getContent("html");
		ArticleNetworkUtil
			.updateArticle(this.props.data)
			.then(({code, msg}) => {
				if (code === 0) {
					message.success(msg);
				} else {
					message.error(msg);
				}
				onConfirm && onConfirm(data);
			})
			.catch(err => {
				message.error("网络异常,编辑失败");
			});
	};
	
	private handleTitleChange = (e) => {
		this.setState({title: e.currentTarget.value});
	};
	
	private handleSelectCover = (file: UploadFile) => {
		ArticleNetworkUtil
			.uploadImg(this.props.data.id, file)
			.then(({code, msg, data}) => {
				if (code === 0) {
					this.props.data.cover = data;
					this.forceUpdate();
					message.success("上传封面成功");
				} else {
					message.error(msg);
				}
				ArticleNetworkUtil.updateArticle(this.props.data);
			})
			.catch(err => {
				message.error("网络异常,上传封面失败");
			});
		return false;
	};
	
	private braftEditor;
}