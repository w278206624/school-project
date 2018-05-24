import {IArticleData} from "../../containers/AddArticle";
import {Articles, IArticlesProps} from "../Articles";
import {Preview} from "../Preview";
import {Button} from "antd";

interface IArticleConnectorProps extends IArticlesProps {
	mode?: "multi" | "sign";
	
	visible?: boolean;
	
	onOk? (select: IArticleData): void;
	
	onOk? (seletes: Array<IArticleData>): void;
	
	onCancel? (): void;
}

export class ArticleConnector extends React.Component<IArticleConnectorProps> {
	public static defaultProps = {
		mode: "multi",
	};
	
	public state = {
		dataList: this.props.dataList.map(data => this.dataFactory(data)),
	};
	
	public componentWillReceiveProps (nextProps) {
		this.state.dataList = nextProps.dataList.map(data => this.dataFactory(data));
	}
	
	public render () {
		const {
			      onCancel,
			      visible,
			      ...articlesProps
		      } = this.props;
		const {dataList} = this.state;
		return (
			<Preview
				visible={visible}
				width={"80%"}
				onCancel={onCancel}
			>
				<Articles
					{...articlesProps}
					dataList={dataList.map(data => ({
						...data,
						actions: [],
					}))}
				/>
				<Button
					type="primary"
					onClick={this.handleOk}
					style={{marginRight: "10px"}}
				>
					确认
				</Button>
				<Button onClick={onCancel}>
					取消
				</Button>
			</Preview>
		)
	}
	
	private dataFactory = (data) => {
		const {mode} = this.props;
		
		const _data: any = {
			...data,
			onSelected: (isSelect) => {
				if (mode === "sign") {
					this.state.dataList.forEach(data => {
						data.isSelected = false;
					});
				}
				_data.isSelected = isSelect;
				this.forceUpdate();
			},
		};
		return _data;
	};
	
	private handleOk = () => {
		const {onOk, mode} = this.props;
		const selects = this.state.dataList
		                    .filter(data => data.isSelected)
		                    .map(item => item.data);
		if (mode === "sign") {
			onOk && onOk(selects[0]);
		} else {
			onOk && onOk(selects);
		}
	};
}