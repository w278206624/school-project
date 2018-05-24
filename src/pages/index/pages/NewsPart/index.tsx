import "./styles.scss";
import {ArticleNetworkUtil} from "specUtils/article";
import {getBreadcrumbsByNavId} from "specUtils/nav";
import {off, on} from "utils/dom";
import {addQueryString, getHashParams} from "utils/url";
import {Banner} from "../components";
import {IBannerCrumb} from "../components/Banner";
import {NewsList} from "./components"

interface INewsPartState {
	currentPage: number;
	dataList: any[];
	total: number;
	pageSize: number;
	partName: string;
	title: string;
	isLoading: boolean;
	breadcrumbs: Array<IBannerCrumb>;
}

export class NewsPart extends React.Component<{}, INewsPartState> {
	public state = {
		currentPage: typeof location !== "undefined" ? (+getHashParams().page || 1) : 1,
		dataList: [],
		total: 0,
		pageSize: 9,
		isLoading: false,
		partName: "",
		title: "",
		breadcrumbs: [],
	};
	
	public render () {
		const {
			      partName,
			      title,
			      breadcrumbs,
			      ...listProps,
		      } = this.state;
		
		return (
			<React.Fragment>
				<Banner partName={partName} title={title} breadcrumbs={breadcrumbs}/>
				<NewsList
					{...listProps}
					onPageChange={this.handlePageChange}
				/>
			</React.Fragment>
		)
	}
	
	public componentDidMount () {
		this.update();
		on(window, "hashchange", this.update);
	}
	
	public componentWillUnmount () {
		ArticleNetworkUtil.cancelRequest();
		off(window, "hashchange", this.update);
	}
	
	private update = () => {
		ArticleNetworkUtil.cancelRequest();
		const {pageSize} = this.state;
		const {title, partName, id, page = 1, topLevel} = getHashParams();
		const breadcrumbs = getBreadcrumbsByNavId(id, window.NAV_DATA);
		
		this.setState({
			title: decodeURI(title),
			partName: decodeURI(partName || "新闻列表"),
			isLoading: true,
			breadcrumbs,
		});
		
		ArticleNetworkUtil
			.getCount(id)
			.then(({code, msg, count}) => {
				if (code === 0) {
					this.setState({
						total: count,
					});
				}
			});
		
		ArticleNetworkUtil
			.requestArticlesForFront({
				topage: +page,
				AreaIds: id,
				max: pageSize,
				TopLevel: topLevel,
			})
			.then(({code, msg, data, count}) => {
				if (code === 0) {
					if (data.length === 1) {
						window.location.hash = "newsDetail?id=" + data[0].id;
					} else {
						this.setState({
							dataList: data,
							total: count || 1,
							isLoading: false,
						});
					}
				} else {
					this.setState({
						isLoading: false,
						dataList: [],
						total: 0,
					})
				}
			})
			.catch(err => {
				console.log(err);
				this.setState({isLoading: false});
			});
	};
	
	private handlePageChange = (page: number) => {
		this.setState({currentPage: page});
		addQueryString({page});
	}
}