import {Modal} from "antd";
import {ModalProps} from "antd/lib/modal";

export const Preview: React.SFC<ModalProps> = (props) => (
	<Modal
		width={750}
		footer={null}
		closable={false}
		{...props}
	>
		{props.children}
	</Modal>
);