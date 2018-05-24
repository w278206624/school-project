import "./styles.scss";
import axios from "axios";
import {ArticleNetworkUtil} from "specUtils/article";
import {articleServerUrl, serverUrl} from "../../../../config";
import {message} from "antd";

interface IBraftEditorProps extends BraftEditor.editorProps {
	id: string | number;
	
	wrapperRef? (wrapper: any): void;
	
	innerRef? (ref: BraftEditor.editorProps): void;
}

export class BraftEditor extends React.Component<IBraftEditorProps> {
	public state = {
		BraftEditor: null,
	};
	
	public render () {
		const {innerRef, ...props} = this.props;
		const {BraftEditor} = this.state;
		return BraftEditor &&
			<BraftEditor
				ref={innerRef}
				media={this.media}
				placeholder="请输入内容"
				{...props}
			/>;
	}
	
	public componentDidMount () {
		const {wrapperRef} = this.props;
		import("braft-editor")
			.then(val => {
				this.setState({BraftEditor: val.default as any});
			});
		if (wrapperRef) {
			wrapperRef(this);
		}
	}
	
	private media = {
		uploadFn: (param) => {
			const id = this.props.id;
			
			if (!id) {
				return false;
			}
			
			ArticleNetworkUtil
				.uploadImg(id, param.file, {
					onUploadProgress: (e) => {
						param.progress(e.loaded / e.total * 100);
					},
				})
				.then(({code, msg, data}) => {
					if (code === 0) {
						param.success({
							url: data,
						});
					} else {
						param.error({
							msg,
						});
						message.error(msg);
					}
				})
				.catch(err => {
					param.error({
						msg: "上传失败",
					});
					message.error("网络异常,请重试");
				});
		},
	};
}