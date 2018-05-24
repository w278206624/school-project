import "./styles.scss";
import {Icon, Upload, Progress, message, Tooltip, Input} from "antd";
import axios from "axios";
import {articleServerUrl} from "../../../../../../config";

interface ITabColumnsTabItemProps {
	data: {
		title: string;
		cover: string;
		id: string | number;
	};
	
	index: number;
	
	onMinusClick? (e: React.MouseEvent<HTMLElement>): void;
	
	onProfileClick? (e: React.MouseEvent<HTMLElement>): void;
}

interface ITabColumnsTabItemState {
	uploadState: UploadState;
	uploadProgress: number;
}


export class Item extends React.Component<ITabColumnsTabItemProps, ITabColumnsTabItemState> {
	public state = {
		uploadState: "wait" as UploadState,
		uploadProgress: 0,
	};
	
	private handleUpload = (file) => {
		const {data} = this.props;
		const fd = new FormData();
		this.setState({uploadState: "uploading"});
		data.cover = URL.createObjectURL(file);
		this.forceUpdate();
		fd.append("file", file);
		fd.append("id", "tabImg");
		axios
			.post(`${articleServerUrl}/PostUpimg`, fd, {
				onUploadProgress: (e) => {
					this.setState({uploadProgress: e.loaded / e.total * 100});
				},
			})
			.then(res => {
				const {code, msg, data} = res.data;
				if (code === 0) {
					message.success(msg);
					this.props.data.cover = data;
					this.setState({uploadState: "complete"});
				} else {
					message.error(msg);
					this.setState({uploadState: "error"});
				}
			})
			.catch(err => {
				this.setState({uploadState: "error"});
			});
		return false;
	};
	
	private handleTitleChange = (e) => {
		this.props.data.title = e.currentTarget.value;
	};
	
	public render () {
		const {
			      data,
			      index,
			      onMinusClick,
			      onProfileClick,
		      } = this.props;
		const {uploadProgress, uploadState} = this.state;
		const uploadClass =
			      uploadState === "wait" ? "hidden"
				      : uploadState === "uploading" ? "mask"
				      : uploadState === "complete" ? "hidden"
					      : uploadState === "error" ? "error" : null;
		const {title, cover, id} = data;
		const Content = (
			<div className={`admin-tab-columns-tab-item${id ? "" : " no-article"}`}>
				<div className="img">
					<div className={uploadClass}>
						<Progress
							className="progress"
							size="small"
							status={uploadState === "error" ? "exception" : uploadState === "complete" ? "success" : "active"}
							percent={uploadProgress}
							showInfo={false}
						/>
					</div>
					<div className={`mask${uploadState === "uploading" ? " js-upload" : ""}`}>
						<Icon
							className="icon center"
							type="profile"
							data-index={"" + index}
							onClick={onProfileClick}
						/>
						<Upload
							className="center"
							beforeUpload={this.handleUpload}
							showUploadList={false}
						>
							<Icon
								type="picture"
								className="icon"
							/>
						</Upload>
						<Icon
							className="icon center"
							type="minus"
							data-index={"" + index}
							onClick={onMinusClick}
						/>
					</div>
					<img src={cover || "/static/test/culture.jpg"}/>
				</div>
				<Input className="title" defaultValue={title} onChange={this.handleTitleChange}/>
			</div>
		);
		
		return id
			? Content
			: (
				<Tooltip title={"没有选择文章"}>
					{Content}
				</Tooltip>
			)
	}
}