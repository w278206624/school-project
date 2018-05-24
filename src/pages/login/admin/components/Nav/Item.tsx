import {
	Collapse,
	Icon,
	Button,
	Upload,
} from "antd"
import {arrayMove, SortableElement} from "react-sortable-hoc";
import {guid} from "utils/crypto";
import {DragHandle} from "../DragHandle";
import {Container, containerConfig} from "./Container";

const {Panel} = Collapse;

type INavItemData = {
	title: string;
	id: string;
	children: any[];
};

interface INavItemProps {
	data: INavItemData;
	order: number;
	maxLevel: number;
	level?: number;
	
	onDelete? (ids: string[], target: INavItemData): void;
	
	onSettingClick? (target: INavItemData): void;
	
	onConnectedClick? (target: INavItemData): void;
	
	[key: string]: any;
}

interface INavItemState {
	data: INavItemData;
}

export class Item extends React.Component<INavItemProps, INavItemState> {
	public static defaultProps = {
		level: -1,
	};
	
	public state = {
		data: this.props.data,
	};
	
	public componentWillReceiveProps (nextProps) {
		this.state.data = nextProps.data;
	}
	
	public render () {
		return (
			<SortableItem
				{...this.props}
				handleDelete={this.handleDelete}
				handleConnectedClick={this.handleConnectedClick}
				handleSettingClick={this.handleSettingClick}
				handleAddItem={this.handleAddItem}
				handleSortEnd={this.handleSortEnd}
				handleSelectCover={this.handleSelectCover}
				data={this.state.data}
				level={this.props.level + 1}
			/>
		);
	}
	
	private handleSortEnd = ({oldIndex, newIndex}) => {
		const {data} = this.state;
		data.children = arrayMove(data.children, oldIndex, newIndex);
		this.forceUpdate();
	};
	
	private handleDelete = (e: React.MouseEvent<HTMLElement>) => {
		e.stopPropagation();
		const {onDelete} = this.props;
		const {data} = this.state;
		onDelete
		&&
		onDelete(Item.getIds(data), data);
	};
	
	private handleSettingClick = (e: React.MouseEvent<HTMLElement>) => {
		e.stopPropagation();
		const {onSettingClick, data} = this.props;
		onSettingClick
		&&
		onSettingClick(data);
	};
	
	private handleConnectedClick = (e: React.MouseEvent<HTMLElement>) => {
		e.stopPropagation();
		const {onConnectedClick, data} = this.props;
		onConnectedClick && onConnectedClick(data);
	};
	
	private handleSelectCover = (file) => {
		return false;
	};
	
	private handleAddItem = () => {
		const {data} = this.state;
		data.children = data.children.concat({
			title: "新栏目",
			id: guid(),
			children: [],
		});
		this.forceUpdate();
	};
	
	private static getIds (data) {
		let result = [data.id];
		data.children.forEach(data => {
			result = result.concat(Item.getIds(data));
		});
		return result;
	}
}

interface ISortableItemProps extends INavItemProps {
	handleDelete (e: React.MouseEvent<HTMLElement>): void;
	
	handleSettingClick (e: React.MouseEvent<HTMLElement>): void;
	
	handleConnectedClick (e: React.MouseEvent<HTMLElement>): void;
	
	handleAddItem (e: React.MouseEvent<HTMLElement>): void;
	
	handleSortEnd (props: any): void;
	
	handleSelectCover (file): boolean;
}

const SortableItem = SortableElement<ISortableItemProps>(({
	                                                          data,
	                                                          order,
	                                                          level,
	                                                          maxLevel,
	                                                          handleDelete,
	                                                          handleSettingClick,
	                                                          handleConnectedClick,
	                                                          handleAddItem,
	                                                          handleSortEnd,
	                                                          handleSelectCover,
	                                                          ...props,
                                                          }) => {
	const {title, id, children} = data;
	return (
		<Collapse className="admin-nav-item">
			<Panel
				showArrow={!!children.length}
				header={
					<div className="admin-nav-item-header">
						<div className="admin-nav-item-title">
							{title}
						</div>
						{level === 0
						&&
						<Upload
							showUploadList={false}
							beforeUpload={handleSelectCover}
						>
							<Icon
								className="admin-nav-item-action"
								type="picture"
							/>
						</Upload>
						}
						{level > 0
						&&
						<Icon
							className="admin-nav-item-action"
							type="profile"
							onClick={handleConnectedClick}
						/>}
						<Icon
							className="admin-nav-item-action"
							type="setting"
							onClick={handleSettingClick}
						/>
						<Icon
							className="admin-nav-item-action"
							type="delete"
							onClick={handleDelete}
						/>
						<DragHandle className="admin-nav-item-action"/>
					</div>
				}
				key={id}
			>
				{!!children.length
				&&
				<Container
					{...containerConfig}
					onSortEnd={handleSortEnd}
				>
					{children.map((child, i) => {
						return (
							<Item
								{...props}
								index={i}
								order={i}
								level={level}
								key={child.id}
								data={child}
								maxLevel={maxLevel}
							/>
						);
					})}
				</Container>}
				{level < (maxLevel - 1)
				&&
				<Button onClick={handleAddItem}>
					添加新导航栏
				</Button>}
			</Panel>
		</Collapse>
	)
});