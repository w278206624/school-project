import {Popconfirm, Tooltip, Icon} from "antd";

interface IArticleActionDeleteProps {
	visible: boolean;
	
	onClick? (e: React.MouseEvent<HTMLElement>): void;
	
	onConfirm? (): void
	
	onCancel? (): void;
}

export const Delete: React.SFC<IArticleActionDeleteProps> = ({
	                                                             visible,
	                                                             onClick,
	                                                             onConfirm,
	                                                             onCancel,
                                                             }) => (
	<Popconfirm
		title="真的要删除吗"
		okText="删除"
		cancelText="取消"
		visible={visible}
		onConfirm={onConfirm}
		onCancel={onCancel}
	>
		<Tooltip title="删除">
			<Icon
				onClick={onClick}
				type="delete"
			/>
		</Tooltip>
	</Popconfirm>
);