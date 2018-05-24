import "./styles.scss";
import {Icon, Row, Col, Pagination} from "antd";
import {PaginationProps} from "antd/lib/pagination";
import {Link} from "components/Router";
import moment from "moment";
import {ArticleNetworkUtil} from "specUtils/article";
import {formatHtml} from "utils/format";
import {ellipsis} from "utils/string";

export type INewsListItem = {
	title: string;
	content: string;
	id: string | number;
	cover: string;
	date: Date | number | moment.Moment;
}

export interface INewsListProps {
	dataList: Array<INewsListItem>;
	dateFormat?: string;
	pagination?: PaginationProps;
}

export interface INewsListState {
	currentPage: number;
}

export class NewsList extends React.Component<INewsListProps, INewsListState> {
	public static defaultProps = {
		dataList: [],
		dateFormat: "YYYY-MM-Do dddd",
	};
	
	public state = {
		currentPage: 1,
	};
	
	public render () {
		const {dataList, dateFormat, pagination} = this.props;
		const {pageSize = 3} = pagination;
		const {currentPage} = this.state;
		const offset = (currentPage - 1) * pageSize;
		
		return (
			<div className="index-news-list">
				{dataList
					.slice(offset, offset + pageSize)
					.map((data, i) => {
						const _data = ArticleNetworkUtil.formatToLocal(data);
						const {title, content, date, id, cover} = _data;
						return (
							<React.Fragment key={i}>
								<Row className="item" gutter={8}>
									<Col
										xs={24}
										sm={8}
										lg={14}
										xxl={14}
										span={12}
									>
										<Link
											to={{
												pathname: "newsDetail",
												query: {
													id,
												},
											}}
											className="red-link"
										>
											{title}
										</Link>
										<p className="content">
											{ellipsis(formatHtml(content), 90)}
										</p>
										<p className="date">
											<Icon type="calendar"/> {moment(date).format(dateFormat)}
										</p>
									</Col>
									<Col
										className="cover-wrapper"
										xs={24}
										sm={16}
										lg={10}
										xxl={10}
										span={12}
									>
										<Link
											className="cover"
											to={{
												pathname: "newsDetail",
												query: {
													id,
												},
											}}
											style={{backgroundImage: `url(${cover || "/static/test/culture.jpg"})`}}
										/>
									</Col>
								</Row>
								{i !== pageSize - 1 ? <div className="split"/> : null}
							</React.Fragment>
						);
					})}
				<Pagination
					pageSize={pageSize}
					{...pagination}
				/>
			</div>
		)
	}
}