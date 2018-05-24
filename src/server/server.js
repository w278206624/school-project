const path = require("path");
const Koa = require("koa");
const koaBody = require("koa-body");
const Router = require("koa-router");
const serve = require("koa-static");
const jdb = require("./jdb");

const app = new Koa();
const router = new Router();
const port = 7777;

const walkDir = require("./utils/walkDir");

walkDir(
	path.join(__dirname, "./route"),
	(filePath) => {
		const requestPath = filePath
			.replace(path.join(__dirname, "/route"), "")
			.replace(".js", "");
		const rootDir = path.basename(path.parse(requestPath).dir);
		if (!jdb.existTab(rootDir)) {
			jdb.createTab(rootDir);
		}
		require(filePath)(requestPath, router, jdb);
	},
	".js",
);

app
	.use(async (ctx, next) => {
		ctx.set("Access-Control-Allow-Origin", "*");
		ctx.set("Access-Control-Allow-Methods", "*");
		ctx.set("Access-Control-Allow-Headers", "X-Requested-With,content-type");
		ctx.set("Access-Control-Allow-Credentials", true);
		await next();
	})
	.use(koaBody())
	.use(serve(path.join(__dirname, "./upload")))
	.use(router.routes())
	.use(router.allowedMethods());
app.listen(7777);

console.log(`server is running in port: ${port}, address: localhost`);
