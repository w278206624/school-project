import {Select} from "antd";
import {SelectProps} from "antd/lib/select";

interface ITagSelectProps extends SelectProps {
	options: Array<{ title: string; value: string | number }>;
}

const {Option} = Select;

export const PartSelect: React.SFC<ITagSelectProps> = (props) => {
	const {options, ...selectProps} = props;
	return (
		<Select
			maxTagCount={2}
			className="part-select"
			mode="multiple"
			placeholder={"请选择分区"}
			{...selectProps}
		>
			{options.map(nav => (
				<Option
					value={nav.value}
					key={nav.value}
				>
					{nav.title}
				</Option>
			))}
		</Select>
	);
};