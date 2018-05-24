const fs = require("fs");
const multer = require("koa-multer");
const pathUtil = require("path");

let tab = [];
let currentUpload;
const uploadDir = pathUtil.join(process.cwd(), "src/server/upload/article");
const storage = multer.diskStorage({
	destination (req, file, cb) {
		const dir = uploadDir + "/" + file.fieldname;
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir);
		}
		cb(null, dir);
	},
	filename (req, file, cb) {
		const filename = `upload${Date.now() + Math.random()}${pathUtil.extname(file.originalname)}`;
		currentUpload = {
			filename,
			id: +file.fieldname,
		};
		cb(null, filename);
	}
});
const upload = multer({
	fileFilter (req, file, cb) {
		return file.mimetype.startsWith("image") ? cb(null, true) : cb("包含不支持的文件类型", false);
	},
	storage,
}).any();

module.exports = function (path, router, db) {
	router.post(path, async (ctx, next) => {
		await upload(ctx.request, ctx.response)
			.then(() => {
				ctx.status = 200;
				ctx.body = {
					code: 0,
					data: `http://localhost:7777/article/${currentUpload.id}/${currentUpload.filename}`,
					msg: "上传成功",
				};
			})
			.catch(err => {
				ctx.status = 403;
				ctx.body = {
					code: 1,
					msg: err,
				};
			});
		return next();
	});
};