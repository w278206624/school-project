import "./styles.scss";
import {UploadFile} from "antd/lib/upload/interface";
import {CarouselNetworkUtil} from "specUtils/carousel";
import {guid} from "utils/crypto";
import {
	Row,
	Col,
	Button,
	notification,
	message,
} from "antd";
import {
	SortableContainer,
	SortableElement,
	arrayMove,
} from "react-sortable-hoc";
import * as ReactCSSTransitionGroup from "react-addons-css-transition-group";
import {accepts} from "utils/file";
import {UploadProgress, CarouselCard, UploadCard} from "../../components";

export class ModifyCarousel extends React.Component<{}, IModifyCarouselState> {
	public state = {
		dataList: [],
		uploadState: "wait" as UploadState,
	};
	
	public createCarouselCard = (data: ICarouselCardData) => {
		let _data = {
			data,
			onBeforeUpload: (file) => {
				if (accepts(file, "image/*")) {
					_data.data.src = URL.createObjectURL(file);
					_data.data.file = file;
					this.forceUpdate();
				} else {
					message.error("只能选择图片");
				}
				return false;
			},
			onRemove: () => {
				const index = this.state.dataList.indexOf(_data);
				this.setState((prevState) => {
					return {dataList: prevState.dataList.filter((_, i) => i !== index)};
				});
				_data = null;
			},
		};
		_data.data.id = guid();
		return _data;
	};
	
	public addCarouselCard = (data: ICarouselCardData) => {
		this.setState((prevState: IModifyCarouselState) => {
			return {dataList: prevState.dataList.concat(this.createCarouselCard(data))};
		});
	};
	
	public render () {
		const {dataList, uploadState} = this.state;
		return (
			<React.Fragment>
				<SortableList
					onSortEnd={this.handleSortEnd}
					transitionDuration={300}
					dataList={dataList}
					onBeforeUpload={this.handleBeforeUpload}
					axis={"xy"}
				/>
				<Button
					onClick={this.startUpload}
					className="modify-carousel-upload-btn"
					type="primary"
					size="large"
					icon="upload"
					disabled={uploadState === "uploading"}
				>
					开始上传
				</Button>
			</React.Fragment>
		);
	}
	
	public componentDidMount () {
		this.fetchData();
	}
	
	public componentWillUnmount () {
		CarouselNetworkUtil.cancelRequest();
	}
	
	private fetchData = () => {
		CarouselNetworkUtil.cancelRequest();
		CarouselNetworkUtil
			.getCarousels()
			.then(({code, msg, data}) => {
				if (code === 0) {
					this.setState({
						dataList: data.map(({ID, Title, ImgPath}) => this.createCarouselCard({
							id: ID,
							desc: Title,
							src: ImgPath,
						})),
					});
					message.success("获取轮播图成功");
				}
			})
			.catch(err => {
			
			});
	};
	
	private startUpload = () => {
		this.setUploadState("uploading");
		let uploadProgress: UploadProgress;
		let lastTime = Date.now();
		let lastLoaded = 0;
		const data = this.state.dataList.map(item => item.data);
		notification.open({
			message: "上传中",
			description: <UploadProgress ref={(ref) => uploadProgress = ref}/>,
			key: "uploadProgress",
			duration: null,
		});
	
		CarouselNetworkUtil
			.updateCarousels(data, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
				onUploadProgress: e => {
					const percent = Math.floor(e.loaded / e.total * 100);
					uploadProgress.setSpeed((e.loaded - lastLoaded) * +(1000 / (Date.now() - lastTime)).toFixed(2));
					lastTime = Date.now();
					lastLoaded = e.loaded;
					if (uploadProgress) {
						uploadProgress.setPercent(percent);
					}
				},
				timeout: 5000,
			})
			.then(({code, msg}) => {
				if (code === 0) {
					this.setUploadState("complete", msg || "上传成功");
				} else {
					this.setUploadState("error", msg);
				}
			})
			.catch(err => {
				this.setUploadState("error", "上传失败,请检查网络连接是否正常");
			});
	};
	
	private handleBeforeUpload = (file: UploadFile) => {
		if (accepts(file, "image/*")) {
			const url = URL.createObjectURL(file);
			this.addCarouselCard({
				src: url,
				desc: "",
				id: guid(),
				file,
			});
		} else {
			message.error("只能选择图片");
		}
		return false;
	};
	
	private handleSortEnd = ({oldIndex, newIndex}) => {
		this.setState({dataList: arrayMove(this.state.dataList, oldIndex, newIndex)});
	};
	
	private setUploadState = (type: UploadState, msg?: string, desc?: string) => {
		switch (type) {
			case "uploading" :
				notification.info({
					message: msg || "开始上传图片",
					description: desc || "请稍等片刻",
				});
				break;
			case "error":
				notification.error({
					message: msg || "上传失败",
					description: desc || "请检查您的网络是否正常",
				});
				notification.close("uploadProgress");
				break;
			case "complete":
				notification.success({
					message: msg || "上传成功",
					description: desc || "",
				});
				setTimeout(() => {
					notification.close("uploadProgress");
				}, 2000);
				break;
		}
		this.setState({uploadState: type});
	};
}

const SortableItem = SortableElement<any>(({
	                                           data,
	                                           onBeforeUpload,
	                                           onRemove,
                                           }) => (
	<Col
		className="card-item"
		span={8}
	>
		<CarouselCard
			data={data}
			onBeforeUpload={onBeforeUpload}
			onRemove={onRemove}
		/>
	</Col>
));

const SortableList = SortableContainer<any>(({
	                                             dataList,
	                                             onBeforeUpload,
                                             }) => (
	<Row
		gutter={8}
		type="flex"
		justify="start"
	>
		<ReactCSSTransitionGroup
			transitionName="carousel-card"
			transitionEnterTimeout={300}
			transitionLeaveTimeout={300}
			className="ant-row-flex ant-row-flex-start"
			component={"div"}
		>
			{dataList.map(({data, onBeforeUpload, onRemove}, i) => (
				<SortableItem
					key={data.id}
					index={i}
					data={data}
					onBeforeUpload={onBeforeUpload}
					onRemove={onRemove}
				/>
			))}
			<Col
				span={8}
				className="card-item"
				key={"upload"}
			>
				<UploadCard onBeforeUpload={onBeforeUpload}/>
			</Col>
		</ReactCSSTransitionGroup>
	</Row>
));

type ICarouselCardData = {
	src: string;
	desc: string;
	articleId?: string | number;
	id?: any,
	file?: UploadFile;
};

interface IModifyCarouselState {
	dataList: any[];
	uploadState: UploadState;
}
