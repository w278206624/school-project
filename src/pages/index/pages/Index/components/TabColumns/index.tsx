import "./styles.scss";
import {Row, Col} from "antd";
import {Link} from "components/Router";
import {fadeIn, fadeOut} from "utils/animation";

export type ITabColumnTab = {
	tabName: string;
	items: Array<{ title: string; cover: string; id: string | number; }>;
}

export interface ITabColumnsProps {
	dataList: Array<ITabColumnTab>;
}

export interface ITabColumnsState {
	selectIndex: number;
}

export class TabColumns extends React.Component<ITabColumnsProps, ITabColumnsState> {
	public static defaultProps = {
		dataList: [],
	};
	
	public state = {
		selectIndex: 0,
	};
	
	public render () {
		const {dataList} = this.props;
		const {selectIndex} = this.state;
		return (
			<div className="index-tab-columns">
				<nav className="tabs">
					<div className="app-wrapper clearfix">
						{dataList.map(({tabName}, i) => (
							<div
								key={i}
								onClick={this.handleTabClick}
								data-index={i}
								className={selectIndex === i ? "tab active" : "tab"}
								style={{width: (100 / dataList.length) + "%"}}
							>
								{i === 0
								&&
								<div
									className="split left"
									style={selectIndex === i ? {backgroundColor: "white"} : null}
								/>}
								{tabName}
							</div>
						))}
					</div>
				</nav>
				<div
					className="items"
					ref={(ref) => this.itemsEl = ref}
				>
					<Row>
						{!!dataList.length
						&&
						dataList[selectIndex].items.map(({title, cover, id}, i) => (
							<Col
								sm={12}
								span={Math.round(24 / dataList[selectIndex].items.length)}
								key={i}
							>
								<Link
									key={i}
									className="item"
									to={{
										pathname: "newsDetail",
										query: {
											id,
										},
									}}
								>
									<img className="cover" src={cover} alt={title}/>
									<p className="title">{title}</p>
								</Link>
							</Col>
						))}
					</Row>
				</div>
			</div>
		);
	}
	
	private itemsEl: HTMLElement;
	
	private handleTabClick = (e: React.MouseEvent<HTMLElement>) => {
		const index = +e.currentTarget.dataset.index;
		if (index === this.state.selectIndex) {
			return;
		}
		
		fadeOut(this.itemsEl, 200, () => {
			this.setState({selectIndex: index}, () => {
				fadeIn(this.itemsEl, 200);
			});
		});
	};
	
}