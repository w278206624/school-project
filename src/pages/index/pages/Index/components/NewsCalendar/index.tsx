import "./styles.scss";
import {Card, DatePicker} from "antd";
import {NewsList} from "../";
import moment from "moment";
import {INewsListItem} from "../NewsList";

const {MonthPicker} = DatePicker;

export interface INewsCalendarProps {
	date: Date | number | moment.Moment;
	dataList: Array<INewsListItem>;
	pageSize?: number;
	onDateChange?: (lastDate: moment.Moment, curDate: moment.Moment) => void;
}

export class NewsCalendar extends React.PureComponent<INewsCalendarProps> {
	public static defaultProps = {
		pageSize: 3,
	};
	
	public render () {
		const {onDateChange, date, dataList} = this.props;
		return (
			<Card
				className="index-news-calendar"
				title={
					<MonthPicker
						defaultValue={moment(date)}
						allowClear={false}
						onChange={(date) => {
							onDateChange && onDateChange(this.lastDate, date);
							this.lastDate = date;
						}}
						disabledDate={NewsCalendar.disabledDate}
					/>
				}
			>
				<NewsList dataList={dataList} dateFormat="Do dddd"/>
			</Card>
		);
	}
	
	private static disabledDate (date: moment.Moment) {
		return moment().isBefore(date);
	}
	
	private lastDate: moment.Moment;
}