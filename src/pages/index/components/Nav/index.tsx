import "./styles.scss";
import {Link} from "components/Router";
import {Row, Col} from "antd";
import {slideDown, slideUp} from "utils/animation";
import {off, on} from "utils/dom";

export type INavItem = {
	title: string;
	id?: string | number;
	children: Array<INavItem>;
}

export interface INavProps {
	dataList: Array<INavItem>;
}

interface INavState {
	cover: string;
	menuList: Array<INavItem>;
	isHideNav: boolean;
}

export class Nav extends React.PureComponent<INavProps, INavState> {
	public state = {
		cover: "",
		menuList: [],
		isHideNav: false,
	};
	
	private nav: HTMLElement;
	
	private menu: HTMLElement;
	
	public render () {
		const {dataList} = this.props;
		const {cover, menuList, isHideNav} = this.state;
		return (
			<nav className={`index-nav app-wrapper clearfix ${isHideNav ? "hide" : "show"}`}>
				<a href="http://www.lnc.edu.cn/" className="school" target="_blank">
					广东岭南职业技术学院
				</a>
				<div className="split"/>
				<Link
					className="college"
					to="/"
				>
					电子信息工程学院
				</Link>
				<div className="right" onMouseLeave={this.hideMenu} ref={(ref) => this.nav = ref}>
					<ul className="nav-list">
						{dataList.map(({title, children, id}, i) => (
							<li
								onClick={this.handleNavItemClick}
								onMouseEnter={this.showMenu}
								data-index={i}
								className="nav-item red-link follow-underline"
								key={id || i}
							>
								{title}
							</li>
						))}
					</ul>
					<div className="menu-wrapper clearfix" ref={(ref) => this.menuEl = ref}>
						<div className="menu-inner">
							<Row>
								<Col span={7}>
									<div className="cover">
										<img src={cover || "/static/test/culture.jpg"}/>
									</div>
								</Col>
								<div className="all-menus" ref={(ref) => this.menu = ref}>
									{(() => {
										const dataListArr = [];
										const result = [];
										for (let i = 0, len = Math.ceil(menuList.length / 3); i < len; i++) {
											dataListArr.push(menuList.slice(i * 3, (i + 1) * 3));
										}
										
										dataListArr.forEach((dataList, i) => {
											result.push(
												<Row className="menu-list" key={i}>
													{dataList.map(({title, link, id, children}, i) => (
														<Col
															className="menu-item"
															span={8}
															key={i}
															onMouseEnter={this.handleMenuItemEnter}
															onMouseLeave={this.handleMenuItemLeave}
														>
															<Link
																className="follow-underline red-link"
																to={{
																	pathname: "newsPart",
																	query: {
																		partName: "新闻列表",
																		title,
																		id,
																	},
																}}
															>
																{title}
															</Link>
															{!!children.length
															&&
															(
																<ul className="sub-menu-list">
																	{children.map(({title, link, id}, i) => (
																		<li className="sub-menu-item" key={id || i}>
																			<Link
																				className="gray-link"
																				to={{
																					pathname: "newsPart",
																					query: {
																						partName: "新闻列表",
																						id,
																						title,
																					},
																				}}
																			>
																				{title}
																			</Link>
																		</li>
																	))}
																</ul>
															)}
														</Col>
													))}
												</Row>,
											)
										});
										return result;
									})()}
								</div>
							</Row>
						</div>
					</div>
				</div>
			</nav>
		)
	}
	
	public componentDidMount () {
		window.NAV_DATA = this.props.dataList;
		this.updateMenuWidth();
		on(document.body, "scroll", this.handleScroll);
		on(window, "resize", this.updateMenuWidth);
	}
	
	public componentWillUnmount () {
		off(document.body, "scroll", this.handleScroll);
	}
	
	private updateMenuWidth = () => {
		setTimeout(() => {
			this.menu.style.width = this.nav.offsetWidth + "px";
		});
	};
	
	private handleMenuItemEnter = (e: React.MouseEvent<HTMLElement>) => {
		const target = e.currentTarget.querySelector(".sub-menu-list") as HTMLElement;
		target && slideDown(target);
	};
	
	private handleMenuItemLeave = (e: React.MouseEvent<HTMLElement>) => {
		const target = e.currentTarget.querySelector(".sub-menu-list") as HTMLElement;
		target && slideUp(target);
	};
	
	private lastScrollTop = 0;
	
	private handleScroll = () => {
		const top = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
		const isScrollToBottom = top > this.lastScrollTop;
		if (isScrollToBottom && top > 70 && !this.state.isHideNav) {
			this.setState({isHideNav: true});
		} else if (this.state.isHideNav && !isScrollToBottom) {
			this.setState({isHideNav: false});
		}
		this.lastScrollTop = top;
	};
	
	private handleNavItemClick = (e: React.MouseEvent<HTMLElement>) => {
		const target = e.currentTarget;
		if (target === this.lastClickEl) {
			this.toggleMenu(e);
		} else {
			this.showMenu(e);
		}
		this.lastClickEl = e.currentTarget;
	};
	
	private toggleMenu = (e: React.MouseEvent<HTMLElement>) => {
		this.menuEl.offsetHeight ? this.hideMenu() : this.showMenu(e);
	};
	
	private showMenu = (e: React.MouseEvent<HTMLElement>) => {
		const index = e.currentTarget.dataset.index;
		this.setState({
			menuList: this.props.dataList[index].children,
		});
		slideDown(this.menuEl);
	};
	
	private hideMenu = () => {
		slideUp(this.menuEl);
	};
	
	private menuEl: HTMLElement;
	
	private lastClickEl: HTMLElement;
}