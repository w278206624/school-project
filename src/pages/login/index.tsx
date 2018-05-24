import "./styles.scss";
import {Form, Input, Icon, Button, Checkbox, message} from "antd";
import {FormComponentProps} from "antd/lib/form";
import {LoginNetworkUtil} from "specUtils/login";
import {NavNetworkUtil} from "specUtils/nav";
import {request} from "specUtils/request";
import Admin from "./admin";

const {Item} = Form;

let Login = class  extends React.Component<FormComponentProps> {
	public static async getInitialProps () {
		let navList = [];
		let publicKey = {};
		
		try {
			await NavNetworkUtil.getNav().then(({data}) => navList = data);
			publicKey = await LoginNetworkUtil.getPublicKey();
		} catch (e) {
		}
		
		return {
			publicKey,
			navDataList: navList,
		};
	}
	
	public state = {
		isLogin: false,
	};
	
	private hideLoading: Function;
	
	private handleSubmit = (e) => {
		e.preventDefault();
		const {form, publicKey} = this.props;
		
		form.validateFields((err, values) => {
			if (!err) {
				this.hideLoading = message.loading("登录中", 0);
				const {username, password, remember} = values;
				const rsa = new RSAKey();
				rsa.setPublic(publicKey.M, publicKey.N);
				
				LoginNetworkUtil
					.requestLogin({
						UserName: username,
						Password: rsa.encrypt(password),
						Remember: +remember,
					})
					.then(({Code, Message}) => {
						if (Code === 0) {
							message.success(Message);
							this.setState({isLogin: true});
						} else {
							message.error(Message);
						}
						this.hideLoading();
					})
					.catch(err => {
						this.hideLoading();
					});
			}
		});
	};
	
	public render () {
		const {form, ...adminProps} = this.props;
		const {getFieldDecorator} = form;
		const {isLogin} = this.state;
		return isLogin
			? (
				<Admin {...adminProps as any}/>
			)
			: (
				<div className="login-wrapper">
					<Form onSubmit={this.handleSubmit} className="login-form">
						<Item>
							{getFieldDecorator("username", {
								rules: [{required: true, message: "请输入用户名"}],
							})(
								<Input
									prefix={<Icon type="user" style={{color: "rgba(0,0,0,.25)"}}/>}
									placeholder="账号"
								/>,
							)}
						</Item>
						<Item>
							{getFieldDecorator("password", {
								rules: [{required: true, message: "请输入密码"}],
							})(
								<Input
									prefix={<Icon type="lock" style={{color: "rgba(0,0,0,.25)"}}/>}
									type="password"
									placeholder="密码"
								/>,
							)}
						</Item>
						<Item>
							<Button type="primary" htmlType="submit" className="login-form-btn">
								登录
							</Button>
							{getFieldDecorator("remember", {
								valuePropName: "checked",
								initialValue: true,
							})(
								<Checkbox>记住我</Checkbox>,
							)}
						</Item>
					</Form>
				</div>
			)
	}
	
	public componentDidMount () {
		window.addEventListener("hashchange", () => {
			request.cancel();
		})
	}
};

Login = Form.create()(Login);

export default Login;