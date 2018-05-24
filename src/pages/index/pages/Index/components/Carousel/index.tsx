import "./styles.scss";
import {Carousel as CarouselComponent, Icon} from "antd";
import {Link as LinkRouter} from "components/Router";

export type ICarouselItem = {
	Title: string;
	ImgPath: string;
	ID?: string | number;
	Link: string | number;
}

export interface ICarouselProps {
	dataList: Array<ICarouselItem>;
}

export class Carousel extends React.PureComponent<ICarouselProps> {
	private carousel: CarouselComponent;
	
	private handlePrevClick = () => {
		this.carousel.prev();
	};
	
	private handleNextClick = () => {
		this.carousel.next();
	};
	
	public render () {
		const {dataList} = this.props;
		return (
			<div className="index-carousel">
				<CarouselComponent
					ref={(ref) => this.carousel = ref}
					fade
					autoplay
					dotsClass="dots"
					customPaging={() => <button/>}
					className="carousel"
				>
					{dataList.map(({Title, ImgPath, ID, Link}, i) => (
						<LinkRouter
							to={{
								pathname: "newsDetail",
								query: {
									id: Link,
								},
							}}
							disable={!Link}
							className="item"
							key={i}
						>
							<div className="image">
								<img src={ImgPath}/>
							</div>
							<span className="title">
								{Title}
							</span>
							<div className="mask"/>
						</LinkRouter>
					))}
				</CarouselComponent>
				<Icon type="left" className="prev" onClick={this.handlePrevClick}/>
				<Icon type="right" className="next" onClick={this.handleNextClick}/>
			</div>
		)
	}
}