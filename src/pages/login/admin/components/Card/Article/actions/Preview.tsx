import {Tooltip, Icon} from "antd";

export const Preview: React.SFC<{ onClick? (e: React.MouseEvent<HTMLElement>): void }> = (props) => (
	<Tooltip title="预览">
		<Icon
			type="eye"
			{...props}
		/>
	</Tooltip>
);