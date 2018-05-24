import {Tooltip, Icon} from "antd";

export const Editor: React.SFC<{ onClick? (e: React.MouseEvent<HTMLElement>): void }> = (props) => (
	<Tooltip title="编辑">
		<Icon
			type="edit"
			{...props}
		/>
	</Tooltip>
);