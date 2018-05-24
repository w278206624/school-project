import {Modal, Form, Input} from "antd";
import {ModalProps} from "antd/lib/modal";

const {Item} = Form;

interface ISettingProps extends ModalProps {
	title: string;
	
	onModify? (title: string): void;
}

export class Setting extends React.PureComponent<ISettingProps> {
	public static defaultProps = {
		title: "",
	};
	
	public state = {
		title: this.props.title,
	};
	
	public componentWillReceiveProps (nextProps) {
		this.state.title = nextProps.title;
	}
	
	private handleOk = () => {
		const {onModify} = this.props;
		onModify && onModify(this.state.title);
	};
	
	private handleChange = (e) => {
		this.setState({title: e.currentTarget.value})
	};
	
	private handleEnter = (e) => {
		if (e.keyCode === 13) {
			this.handleOk();
		}
	};
	
	public render () {
		const {title, onModify, ...modalProps} = this.props;
		return (
			<Modal
				okText="确认"
				cancelText="取消"
				onOk={this.handleOk}
				{...modalProps}
			>
				<Form layout="horizontal">
					<Item label="菜单名称">
						<Input
							type="text"
							value={this.state.title}
							onChange={this.handleChange}
							onKeyDown={this.handleEnter}
						/>
					</Item>
				</Form>
			</Modal>
		)
	}
}