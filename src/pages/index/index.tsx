import "./styles.scss";
import {NavNetworkUtil} from "specUtils/nav";
import {Nav, Footer} from "./components";
import {Router, Route} from "components/index";
import {IndexPage, NewsDetailPage, NewsPart} from "./pages";
import moment from "moment";
import "moment/locale/zh-cn";

moment.locale("zh-cn");

let navList = [];

export default class extends React.Component {
	public static async getInitialProps () {
		let data = {};
		try {
			const res = await NavNetworkUtil.getNav();
			data = {
				navList: res.data,
			};
		} catch (e) {
			data = {
				navList: [],
			};
		}
		return data;
	}
	
	public static defaultProps = {
		navList: [],
	};
	
	public render () {
		if (this.props.navList.length) {
			navList = this.props.navList;
		}
		return (
			<React.Fragment>
				<Nav dataList={navList}/>
				<div style={{marginTop: "70px"}}>
					<Router>
						<Route path="/"><IndexPage/></Route>
						<Route path="newsPart"><NewsPart/></Route>
						<Route path="newsDetail"><NewsDetailPage/></Route>
					</Router>
				</div>
				<Footer/>
			</React.Fragment>
		);
	}
	
	
	public componentDidMount () {
	
	}
}