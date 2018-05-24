import {Select} from "antd";
import {SelectProps} from "antd/lib/select";

interface ISortModeSelectProps extends SelectProps {
	modes: string[];
}

const {Option} = Select;

const modesHook = {
	date: "按时间排序",
	top: "按置顶排序",
	part: "按分区排行",
};

export const SortModeSelect: React.SFC<ISortModeSelectProps> = (props) => {
	const {modes, ...selectProps} = props;
	return (
		<Select {...selectProps}>
			{modes.map((mode) => <Option key={mode} value={mode}>{modesHook[mode] || ""}</Option>)}
		</Select>
	)
};