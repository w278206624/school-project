import "./styles.scss";
import {Icon, Row, Col} from "antd";

export function Footer () {
	return (
		<footer className="index-footer">
			<Row>
				<Col span={10}>
					<div className="copyright">
						<p>地址： 广东广州天河东圃大观中路492号</p>
						<p>电话： 020-22305690</p>
						<p>传真： 020-22305574</p>
						<p>ICP备案编号： 粤ICP备05084255号 2005-2014 College Of Electronic and Information</p>
						<p>©广东岭南职业技术学院电子信息工程学院 http://cie.lnc.edu.cn/</p>
					</div>
				</Col>
				<Col span={10}>
					<div className="info">
						<span className="qr-code-wrapper">
							<div className="qr-code">
								<img src="/static/test/qrcode.jpg" alt="qrcode"/>
								<Icon className="arrow" type="caret-down"/>
							</div>
							<Icon className="icon" type="wechat"/>
						</span>
						<a href="https://weibo.com/lndianxin" target="_blank">
							<Icon className="icon" type="weibo"/>
						</a>
					</div>
				</Col>
				<Col span={4}>
					<div className="extra-link-wrapper">
						<p className="extra-link-title">服务平台</p>
						<ul className="extra-link-list">
							<li className="extra-link-item">
								<a className="extra-link" href="#link">教师OA</a>
							</li>
							<li className="extra-link-item">
								<a className="extra-link" href="#link">青果教务</a>
							</li>
							<li className="extra-link-item">
								<a className="extra-link" href="#link">在线学习</a>
							</li>
							<li className="extra-link-item">
								<a className="extra-link" href="#link">技能鉴定</a>
							</li>
							<li className="extra-link-item">
								<a className="extra-link" href="#link">资料专区</a>
							</li>
						</ul>
					</div>
				</Col>
			</Row>
		</footer>
	)
}