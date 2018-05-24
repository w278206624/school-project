import {message} from "antd";
import {NavNetworkUtil} from "specUtils/nav";
import {Nav} from "../../components/";

interface INavData {
	title: string;
	children: Array<INavData>;
	id: string;
}

interface IModifyNavProps {
	dataList: Array<INavData>;
}

export class ModifyNav extends React.Component<IModifyNavProps> {
	private deletes = [];
	
	public render () {
		const {dataList} = this.props;
		return (
			<Nav
				onDelete={this.handleDelete}
				onSave={this.handleSave}
				navList={dataList}
			/>
		)
	}
	
	private handleDelete = (ids) => {
		this.deletes = this.deletes.concat(ids);
	};
	
	private handleSave = (dataList) => {
		if (this.deletes.length) {
			NavNetworkUtil
				.deleteNav(this.deletes)
				.then(data => console.log(data))
				.catch(err => console.log(err));
		}
		
		if (dataList.length) {
			this.hideLoading = message.loading("保存中", 0);
			NavNetworkUtil
				.updateNav(dataList)
				.then(({code, msg}) => {
					this.hideLoading();
					if (code === 0) {
						message.success(msg);
					} else {
						message.error(msg);
					}
				})
				.catch(err => {
					this.hideLoading();
					message.error("保存失败");
				});
		} else {
			message.info("请添加导航栏");
		}
	};
	
	private hideLoading: Function;
}