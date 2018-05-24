import "./styles.scss";
import {ArticleNetworkUtil} from "specUtils/article";
import {getBreadcrumbsByNavId} from "specUtils/nav";
import {off, on} from "utils/dom";
import {getHashParams} from "utils/url";
import {Card, Icon} from "antd";
import {Banner} from "../components";
import {IBannerCrumb} from "../components/Banner";

interface INewsDetailState {
	isLoading: boolean;
	title: string;
	partName: string;
	breadcrumbs: Array<IBannerCrumb>;
	content: string;
	error?: {
		type?: string;
		msg: string;
	};
}

export class NewsDetailPage extends React.Component<{}, INewsDetailState> {
	public state = {
		isLoading: false,
		title: "",
		partName: "加载中",
		breadcrumbs: [],
		content: "",
		error: null,
	};
	
	public render () {
		const {
			      isLoading,
			      content,
			      error,
			      ...bannerData,
		      } = this.state;
		return (
			<React.Fragment>
				<Banner {...bannerData}/>
				<div className="news-detail-content-wrapper">
					<Card loading={isLoading} className="news-detail-content">
						{error
							? (
								<div className="error" onClick={this.update}>
									<Icon className="icon" type="reload"/>
									<p className="msg">{error.msg}<Icon type="frown-o"/></p>
								</div>
							)
							: (
								<div
									dangerouslySetInnerHTML={{
										__html: content,
									}}
								/>
							)}
					</Card>
				</div>
			</React.Fragment>
		);
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
		this.setState({isLoading: true});
		const {id, areaId} = getHashParams();
		
		if (!id) {
			return;
		}
		
		this.setState({
			breadcrumbs: getBreadcrumbsByNavId(areaId, window.NAV_DATA),
			isLoading: true,
		});
		
		ArticleNetworkUtil
			.requestArticleForFront(id)
			.then(({code, msg, data}) => {
				if (code === 0) {
					const {title, content} = data;
					this.setState({
						partName: "新闻详情",
						title,
						content,
						isLoading: false,
						error: null,
					});
				} else {
					this.setState({
						error: {
							msg,
						},
						isLoading: false,
					});
				}
			})
			.catch(err => {
				this.setState({
					error: {
						msg: "网络异常,点击刷新重试",
					},
					isLoading: false,
				});
			});
	}
}