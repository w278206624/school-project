import {Tooltip, Select} from "antd";

const {Option} = Select;

type IArticleActionTopLevelItem = {
	title: string;
	value: string | number;
}

interface IArticleActionTopLevelProps {
	options?: Array<IArticleActionTopLevelItem>;
	defaultValue?: any;
	
	onChange? (value: Array<string | number>): void;
}

const defaultOptions = [
	{
		title: "默认",
		value: 0,
	},
	{
		title: "重要事件",
		value: 1,
	},
	{
		title: "纪事报",
		value: 2,
	},
];


export const TopLevel: React.SFC<IArticleActionTopLevelProps> = ({
	                                                                 defaultValue = 0,
	                                                                 onChange,
	                                                                 options = defaultOptions,
                                                                 }) => (
	<Tooltip title={"更改置顶等级"}>
		<Select
			defaultValue={defaultValue}
			className="top-level"
			onChange={onChange}
		>
			{options.map(({value, title}, i) => (
				<Option key={i} value={value}>{title}</Option>
			))}
		</Select>
	</Tooltip>
);