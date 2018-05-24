import "./styles.scss";
import {Card, Upload, Icon} from "antd"
import {UploadFile} from "antd/lib/upload/interface";

const {Meta} = Card;
const {Dragger} = Upload;

export interface IUploadCardProps {
	onBeforeUpload (file: UploadFile,
	                fileList: Array<UploadFile>): boolean | Promise<any>;
	
	action?: string;
}

export default class extends React.Component<IUploadCardProps> {
	public static defaultProps = {
		action: "http://10.160.20.161:7777/upload",
	};
	
	public render () {
		const {onBeforeUpload, action} = this.props;
		return (
			<Card
				className="carousel-upload"
				hoverable
				cover={
					<Dragger
						multiple
						action={action}
						beforeUpload={onBeforeUpload}
						listType="picture-card"
						showUploadList={false}
						accept="image/*"
					>
						<p className="ant-upload-drag-icon">
							<Icon type="picture"/>
						</p>
						<p className="ant-upload-text">点击或拖拽图片到此区域即可上传</p>
					</Dragger>
				}
			>
				<Meta
					title="上传图片"
					description="可拖拽图片或点击上面框框即可上传哦"
				/>
			</Card>
		);
	}
}