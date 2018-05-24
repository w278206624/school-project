import "./styles.scss";
import {Tabs, Row, Col} from "antd";
import {ArticleNetworkUtil} from "specUtils/article";
import {CarouselNetworkUtil} from "specUtils/carousel";
import {TabNetworkUtil} from "specUtils/tab";
import {
	Carousel,
	Chronicle,
	NewsCalendar,
	NewsList,
	TabColumns,
} from "./components";
import {ICarouselItem} from "./components/Carousel";
import {IChronicleItem} from "./components/Chronicle";
import {INewsListItem} from "./components/NewsList";
import {ITabColumnTab} from "./components/TabColumns";

const {TabPane} = Tabs;

export interface IIndexPageProps {
	carouselDataList: Array<ICarouselItem>;
	// importantArticleDataList: Array<INewsListItem>;
	latestArticleProps: {
		dataList: Array<INewsListItem>;
		total: number;
	};
	chronicleArticleDataList: Array<IChronicleItem>;
	tabColumnDataList: Array<ITabColumnTab>;
}

interface IIndexPageState {
	carouselDataList: Array<ICarouselItem>;
	// importantArticleDataList: Array<INewsListItem>;
	latestArticleDataList: Array<INewsListItem>;
	latestArticleTotal: number;
	latestArticleCurrent: number;
	chronicleArticleDataList: Array<IChronicleItem>;
	tabColumnDataList: Array<ITabColumnTab>;
}

export class IndexPage extends React.Component<{}, IIndexPageState> {
	public state = {
		carouselDataList: [],
		latestArticleDataList: [],
		latestArticleTotal: 0,
		latestArticleCurrent: 1,
		chronicleArticleDataList: [],
		tabColumnDataList: [],
	};
	
	private handleLatestPageChange = (page: number) => {
		this.setState({
			latestArticleCurrent: page,
		});
		ArticleNetworkUtil
			.requestArticlesForFront({
				topage: page,
				TopLevel: 0,
				max: 3,
			})
			.then(({data, count}) => {
				this.setState({
					latestArticleDataList: data,
					latestArticleTotal: count,
				});
			})
	};
	
	public render () {
		const {
			      carouselDataList,
			      latestArticleDataList,
			      latestArticleTotal,
			      latestArticleCurrent,
			      chronicleArticleDataList,
			      tabColumnDataList,
		      } = this.state;
		return (
			<React.Fragment>
				<Carousel dataList={carouselDataList}/>
				<div className="index-news-tabs app-wrapper">
					<div className="clearfix">
						<Row gutter={12}>
							<Col className="tabs" xs={24} sm={24} md={24} lg={16} id="_index-news-tabs">
								<Tabs defaultActiveKey={"2"}>
									{/*<TabPane tab={"重要事件"} key={1}>*/}
									{/*<NewsCalendar*/}
									{/*dataList={importantArticleDataList}*/}
									{/*date={new Date()}*/}
									{/*/>*/}
									{/*</TabPane>*/}
									<TabPane tab={"最新事件"} key={2}>
										<NewsList
											dataList={latestArticleDataList}
											pagination={{
												total: latestArticleTotal,
												pageSize: 3,
												current: latestArticleCurrent,
												onChange: this.handleLatestPageChange,
											}}
										/>
									</TabPane>
								</Tabs>
							</Col>
							<Col xs={24} sm={24} md={24} lg={8}>
								<Chronicle dataList={chronicleArticleDataList}/>
							</Col>
						</Row>
					</div>
				</div>
				<TabColumns dataList={tabColumnDataList}/>
			</React.Fragment>
		)
	}
	
	public componentDidMount () {
		CarouselNetworkUtil
			.getCarousels()
			.then(({data}) => this.setState({carouselDataList: data}));
		
		ArticleNetworkUtil
			.requestArticlesForFront({
				topage: 1,
				TopLevel: 0,
				max: 3,
			})
			.then(({data, count}) => {
				this.setState({
					latestArticleDataList: data,
					latestArticleTotal: count,
				})
			});
		
		ArticleNetworkUtil
			.requestArticlesForFront({
				topage: 1,
				TopLevel: 2,
				max: 3,
			})
			.then(({data}) => {
				this.setState({
					chronicleArticleDataList: data,
				});
			});
		
		TabNetworkUtil
			.getTab()
			.then(({data}) => this.setState({
				tabColumnDataList: data,
			}))
	}
}