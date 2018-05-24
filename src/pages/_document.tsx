import Document, {Head, Main, NextScript} from "next/document";

export default class CustomDoc extends Document {
	render () {
		return (
			<html>
			<Head>
				<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0"/>
				<title>电信学院</title>
				<script src="/static/Rsa1.js"/>
				<script src="/static/jsbn.js"/>
				<script src="/static/prng4.js"/>
				<script src="/static/rng.js"/>
				{typeof Array.prototype.forEach === "undefined" && <script src="/static/es5-shim.min.js"/>}
				{typeof Promise === "undefined" && <script src="/static/promise-shim.min.js"/>}
				<link href="/_next/static/style.css" rel="stylesheet"/>
			</Head>
			<body>
			<Main/>
			<NextScript/>
			</body>
			</html>
		);
	}
}