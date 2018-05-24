import {Icon} from "antd";
import {IconProps} from "antd/lib/icon";
import {SortableHandle} from "react-sortable-hoc";

function handleClick (e: React.MouseEvent<HTMLElement>) {
	e.stopPropagation();
}

export const DragHandle = SortableHandle<any>((props: IconProps) => (
	<Icon
		onClick={handleClick}
		type="bars"
		{...props}
	/>
));