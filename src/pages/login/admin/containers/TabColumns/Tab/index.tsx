import "./styles.scss";
import {Icon, Input} from "antd";
import {Item} from "./Item";

export type ITabColumnsItemData = {
	title: string;
	id: string | number;
	cover: string;
}

type ITabColumnsTab = {
	tabName: string;
	items: Array<ITabColumnsItemData>
}

interface ITabColumnsTabProps {
	data: ITabColumnsTab;
	
	onProfileClick? (target: ITabColumnsItemData);
	
	maxItems?: number;
}

export class Tab extends React.Component<ITabColumnsTabProps> {
	public static defaultProps = {
		maxItems: 4,
	};
	
	private handleTabNameChange = (e) => {
		this.props.data.tabName = e.currentTarget.value;
	};
	
	private handleProfileClick = (e: React.MouseEvent<HTMLElement>) => {
		const {onProfileClick, data} = this.props;
		onProfileClick && onProfileClick(data.items[+e.currentTarget.dataset.index]);
	};
	
	private addItem = () => {
		this.props.data.items.push({
			title: "新标签",
			cover: "",
			id: null,
		});
		this.forceUpdate();
	};
	
	private removeItem = (e: React.MouseEvent<HTMLElement>) => {
		const {items} = this.props.data;
		items.splice(+e.currentTarget.dataset.index, 1);
		this.forceUpdate();
	};
	
	public render () {
		const {data, maxItems} = this.props;
		const {tabName, items} = data;
		
		return (
			<div className="admin-tab-column-tab">
				<div className="tab">
					<Input className="input" defaultValue={tabName} onChange={this.handleTabNameChange}/>
				</div>
				<div className="panel clearfix">
					{items.map((data, i) => (
						<Item
							key={i}
							data={data}
							index={i}
							onMinusClick={this.removeItem}
							onProfileClick={this.handleProfileClick}
						/>
					))}
					{items.length < maxItems
					&&
					<div className="add-item">
						<Icon className="icon" type="plus" onClick={this.addItem}/>
					</div>}
				</div>
			</div>
		)
	}
}