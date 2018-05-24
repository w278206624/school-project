import "./styles.scss";
import {Progress} from "antd";
import {formatByte} from "utils/format";

interface IUploadProgressState {
	percent: number;
	speed: number;
}

export class UploadProgress extends React.Component<{}, IUploadProgressState> {
	public state = {
		percent: 0,
		speed: 0,
	};
	
	public setPercent = (percent: number) => {
		this.setState({percent});
	};
	
	public setSpeed = (speed: number) => {
		this.setState({speed});
	};
	
	public render () {
		const {percent, speed} = this.state;
		const covert = 1024 * 4;
		return (
			<div className="progress-wrapper">
				<div className="hide"/>
				<Progress
					className="upload-progress"
					type="circle"
					percent={percent}
					width={150}
				/>
				<Progress
					className="upload-speed-progress"
					type="dashboard"
					percent={speed / covert}
					format={percent => `${formatByte(percent * covert)}/s`}
					width={150}
				/>
			</div>
		);
	}
};