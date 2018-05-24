import "./styles.scss";
import {
	Layout,
	Menu,
} from "antd";
import {NavNetworkUtil} from "specUtils/nav";
import {
	ModifyCarousel,
	AddArticle,
	ModifyArticle,
	ModifyNav,
	Draft,
	TabColumns,
} from "./containers";
import {
	Router,
	Route,
	Link,
} from "components/Router";
import axios from "axios";

const {Content, Sider} = Layout;
const {Item} = Menu;

interface IAdminProps {
	navDataList: any[];
}

interface IAdminState {
	isCollapsed: boolean;
}

export default class extends React.Component<IAdminProps, IAdminState> {
	public static async getInitialProps () {
		let navDataList = [];
		
		try {
			await NavNetworkUtil.getNav().then(({data}) => navDataList = data);
		} catch (e) {
		}
		
		return {
			navDataList,
		};
	}
	
	public state = {
		isCollapsed: false,
	};
	
	private setCollapsed = (isCollapsed: boolean) => {
		this.setState({isCollapsed});
	};
	
	public render () {
		const {navDataList} = this.props;
		const {isCollapsed} = this.state;
		
		if (typeof window !== "undefined") {
			window.NAV_DATA = navDataList;
		}
		
		return (
			<Layout style={{width: "100%", height: "100vh"}} hasSider>
				<Sider
					collapsible
					collapsed={isCollapsed}
					onCollapse={this.setCollapsed}
				>
					{typeof location !== "undefined"
						? (
							<Menu
								className={isCollapsed ? "menu-collapse" : ""}
								defaultSelectedKeys={
									(location.hash === "#/"
										|| location.hash === "")
										? ["/"]
										: [location.hash.slice(1)]
								}
								theme="dark"
							>
								<Item key="/">
									<Link to="/">
										修改导航栏
									</Link>
								</Item>
								<Item key="carousel">
									<Link to="carousel">
										修改轮播图
									</Link>
								</Item>
								<Item key="addArticle">
									<Link to="addArticle">
										发布文章
									</Link>
								</Item>
								<Item key="modifyArticle">
									<Link to="modifyArticle">
										修改文章
									</Link>
								</Item>
								<Item key="draft">
									<Link to="draft">
										草稿箱
									</Link>
								</Item>
								<Item key="tabColumns">
									<Link to="tabColumns">
										特色栏
									</Link>
								</Item>
							</Menu>
						)
						: null}
				</Sider>
				<Layout>
					<Content className="antd-content-overwrite">
						<Router>
							<Route path="/">
								<ModifyNav dataList={navDataList}/>
							</Route>
							<Route path="carousel">
								<ModifyCarousel/>
							</Route>
							<Route path="addArticle">
								<AddArticle/>
							</Route>
							<Route path="modifyArticle">
								<ModifyArticle/>
							</Route>
							<Route path="draft">
								<Draft/>
							</Route>
							<Route path="tabColumns">
								<TabColumns/>
							</Route>
						</Router>
					</Content>
				</Layout>
			</Layout>
		);
	}
	
	public componentDidMount () {
		window.axios = axios;
	}
}
