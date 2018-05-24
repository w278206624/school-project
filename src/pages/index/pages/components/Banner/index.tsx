import "./styles.scss";
import {Row, Col} from "antd";
import {Link} from "components/Router";
import {ILinkTo} from "components/Router/Link";

export type IBannerCrumb = {
	name: string;
	to: ILinkTo;
}

export interface IBannerProps {
	partName: string;
	breadcrumbs?: Array<IBannerCrumb>;
	title: string;
	trapezoidalWidth?: string;
	trapezoidalColor?: string;
	backgroundColor?: string;
}

export class Banner extends React.Component<IBannerProps> {
	public static defaultProps = {
		breadcrumbs: [],
		trapezoidalWidth: "45%",
		trapezoidalColor: "#dddddd",
		backgroundColor: "white",
	};
	
	public componentDidUpdate () {
		this.colorBlockEl.style.borderWidth = this.bannerEl.offsetHeight + "px";
	}
	
	public render () {
		const {
			      partName,
			      breadcrumbs,
			      title,
			      backgroundColor,
			      trapezoidalWidth,
			      trapezoidalColor,
		      } = this.props;
		const crumbsLen = breadcrumbs.length;
		return (
			<div
				className="pages-banner app-wrapper"
				style={{backgroundColor}}
				ref={(ref) => this.bannerEl = ref}
			>
				<div
					className="color-block"
					style={{
						width: trapezoidalWidth,
						borderBottomColor: trapezoidalColor,
					}}
					ref={(ref) => this.colorBlockEl = ref}
				/>
				<Row>
					<Col span={8} className="part-wrapper">
						<div className="part-inner">
							<p className="part">
								{partName}
							</p>
							<Link
								className="breadcrumb"
								to="/"
							>
								首页&nbsp;&nbsp;/&nbsp;&nbsp;
							</Link>
							{breadcrumbs.map(({name, to}, i) => (
								<React.Fragment key={i}>
									<Link className="breadcrumb" to={to}>
										{name}
									</Link>
									{i !== crumbsLen - 1
										? <React.Fragment>&nbsp;&nbsp;/&nbsp;&nbsp;</React.Fragment>
										: null}
								</React.Fragment>
							))}
						</div>
					</Col>
					<Col span={16} className="title">
						{title}
					</Col>
				</Row>
			</div>
		);
	}
	
	private bannerEl: HTMLElement;
	
	private colorBlockEl: HTMLElement;
}