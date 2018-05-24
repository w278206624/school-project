import "./styles.scss";
import {Link} from "components/Router";
import {Row, Col, Icon, Pagination} from "antd";
import moment from "moment";
import {formatHtml} from "utils/format";

export type INewsListItem = {
	title: string;
	content: string;
	id: string | number;
	date: Date | number | moment.Moment;
	cover: string;
	areaId: string;
}

export interface INewsListProps {
	dataList: Array<INewsListItem>
	pageSize?: number;
	total?: number;
	currentPage?: number;
	onPageChange?: (page: number) => void;
	isLoading?: boolean;
}

export class NewsList extends React.Component<INewsListProps> {
	public static defaultProps = {
		pageSize: 9,
		currentPage: 1,
	};
	
	public state = {
		currentPage: this.props.currentPage,
	};
	
	public componentWillReceiveProps (nextProps) {
		this.state.currentPage = nextProps.currentPage;
	}
	
	private handlePageChange = (page: number) => {
		const {onPageChange} = this.props;
		this.setState({
			currentPage: page,
		});
		onPageChange && onPageChange(page);
	};
	
	public render () {
		const {
			      dataList,
			      total,
			      pageSize,
			      isLoading,
			      currentPage,
		      } = this.props;
		const remain = total > 0 ? total - ((currentPage - 1) * pageSize) : 0;
		const list = isLoading
			? new Array(remain > pageSize ? pageSize : remain).fill({})
			: dataList;
		return (
			<div
				className="news-part-news-list"
				style={{backgroundColor: "#f2f2f2"}}
			>
				{total > 0
					? list.map(({
						            title,
						            content,
						            cover,
						            date,
						            id,
						            areaId,
					            }, i) => {
						const loadingClass = isLoading ? " loading-block" : "";
						return (
							<Link
								className={isLoading ? "loading" : null}
								key={i}
								to={{
									pathname: "newsDetail",
									query: {
										id,
										areaId,
									},
								}}
							>
								<div className="item clearfix">
									<Row>
										<Col span={18}>
											<div className="text-wrapper">
												<p className={`title${loadingClass}`}>
													{title && title}
												</p>
												<p className={`content${loadingClass}`}>
													{content && formatHtml(content)}
												</p>
												<p className={`date${loadingClass}`}>
													<Icon
														className="icon"
														spin={isLoading}
														type="clock-circle-o"
													/>
													{date && moment(date).format("YYYY-MM-DD dddd")}
												</p>
											</div>
										</Col>
										<Col span={6}>
											<img
												className={`cover`}
												src={cover || "/static/test/culture.jpg"}
												alt={title}
											/>
										</Col>
									</Row>
								</div>
							</Link>
						)
					})
					: (
						<div className="no-data">
							<Icon className="icon" type={isLoading ? "loading" : "warning"}/>
							<span>{isLoading ? "加载中" : "此处无内容"}</span>
						</div>
					)}
				<Pagination
					className="page-controller"
					showQuickJumper
					current={currentPage}
					defaultPageSize={pageSize}
					onChange={this.handlePageChange}
					total={total}
				/>
			</div>
		)
	}
}