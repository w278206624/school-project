const pathUtil = require("path");
const clearDir = require("../../../utils/clearDir");
const multer = require("koa-multer");

function parseField (field) {
	return {
		index: +field.slice(field.indexOf("[") + 1, field.indexOf("]")),
		property: pathUtil.extname(field).slice(1),
	}
}

let tab;
const uploadDir = pathUtil.join(process.cwd(), "src/server/upload/carousel");
const storage = multer.diskStorage({
	destination (req, file, cb) {
		cb(null, uploadDir);
	},
	filename (req, file, cb) {
		const index = parseField(file.fieldname).index;
		const filename = `upload${Date.now() + Math.random()}${pathUtil.extname(file.originalname)}`;
		if (!tab[index]) {
			tab[index] = {};
		}
		tab[index].ImgPath = `http://localhost:7777/carousel/${filename}`;
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
	tab = db.selectTab("carousel");
	router.post(path, async (ctx, next) => {
		tab = [];
		db.modifyTab(tab, "carousel");
		await upload(ctx.request, ctx.response)
			.then(() => {
				const fields = ctx.req.body;
				const relyImg = [];
				Object
					.keys(fields)
					.forEach(field => {
						const value = fields[field];
						const parse = parseField(field);
						const index = parse.index;
						const property = parse.property;
						if (!tab[index]) {
							tab[index] = {};
						}
						if ((property === "ImgPath" && !value) || property === "file") {
							return;
						}
						tab[parse.index][property] = value;
					});
				tab.forEach(data => {
					if (data.ImgPath) {
						relyImg.push(pathUtil.basename(data.ImgPath));
					}
				});
				clearDir(uploadDir, (filePath) => {
					return !relyImg.includes(pathUtil.basename(filePath));
				});
				db.modifyTab(tab, "carousel");
				ctx.status = 201;
				ctx.body = {
					code: 0,
					data: "http://localhost:7777/carousel/getCarousels",
					msg: "上传成功",
				};
			})
			.catch(err => {
				ctx.status = 400;
				ctx.body = {
					code: 1,
					data: null,
					msg: err,
				};
			});
		return next();
	});
};
