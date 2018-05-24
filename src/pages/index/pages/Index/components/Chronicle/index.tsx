import "./styles.scss";
import {Link} from "components/Router";
import {ArticleNetworkUtil} from "specUtils/article";
import {off, on} from "utils/dom";
import {formatHtml} from "utils/format";
import {ellipsis} from "utils/string";

export type IChronicleItem = {
	id?: string | number;
	title: string;
	content: string;
}

export interface IChronicleProps {
	dataList: Array<IChronicleItem>;
	style?: React.CSSProperties;
	className?: string;
}

export class Chronicle extends React.Component<IChronicleProps> {
	public render () {
		const {
			      dataList,
			      ...styles,
		      } = this.props;
		
		return (
			<div
				className="index-chronicle"
				ref={(el) => this.el = el}
				{...styles}
			>
				<div className="title">
					<Link
						className="header red-link"
						to={{
							pathname: "newsPart",
							query: {
								topLevel: 2,
								title: "纪事报",
							},
						}}
					>
						纪事报
					</Link>
					<div className="split"/>
				</div>
				<div className="list">
					{dataList.slice(0, 3).map((data, i) => {
						const _data = ArticleNetworkUtil.formatToLocal(data);
						const {title, id, content} = _data;
						return (
							<div
								className="item"
								key={i}
							>
								<Link
									to={{
										pathname: "newsDetail",
										query: {
											id,
										},
									}}
									className="title red-link"
								>
									{title}
								</Link>
								<p className="content js-chronicle-item-content">{ellipsis(formatHtml(content), 70)}</p>
								<div className="split"/>
							</div>
						)
					})}
				</div>
				<div className="read-more">
					<Link
						to={{
							pathname: "newsPart",
							query: {
								topLevel: 2,
								title: "纪事报",
							},
						}}
					>
						查看更多
					</Link>
				</div>
			</div>
		)
	}
	
	public componentDidMount () {
		this.wrapperEl = document.getElementById("_index-news-tabs");
		this.updateHeight();
		setTimeout(() => {
			const items = document.querySelectorAll(".js-chronicle-item-content");
			Array.from(items)
			     .forEach(item => {
				     const style = window.getComputedStyle(item);
				     const line = parseFloat(style.height) / parseFloat(style.lineHeight);
				     console.log(Math.round(line));
			     });
		});
		on(window, "resize", this.updateHeight);
	}
	
	public componentWillUnmount () {
		off(window, "resize", this.updateHeight);
	}
	
	private el: HTMLElement;
	
	private wrapperEl: HTMLElement;
	
	private updateHeight = () => {
		const height = this.wrapperEl.offsetHeight;
		if (window.innerWidth > 991 && height > 700) {
			this.el.style.minHeight = height + 10 + "px";
		} else {
			this.el.style.minHeight = "auto";
		}
	}
}