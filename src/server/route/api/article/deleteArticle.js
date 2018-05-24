const path = require("path");
const fs = require("fs");
const clearDir = require("../../../utils/clearDir");
const saveDir = path.join(process.cwd(), "src/server/upload/article");

module.exports = function (path, router, db) {
	router.delete(path, (ctx, next) => {
		const tab = db.selectTab("article");
		const query = ctx.request.query;
		const dirPath = `${saveDir}/${query.id}`;
		if (query.id && !Number.isNaN(+query.id)) {
			tab[+query.id] = null;
			if (fs.existsSync(dirPath)) {
				clearDir(dirPath, () => true, true);
				fs.rmdir(dirPath, (err) => console.log(err));
			}
			db.modifyTab(tab, "article");
			ctx.status = 200;
			ctx.body = {
				code: 0,
				msg: "删除文章成功",
			};
		} else {
			ctx.status = 204;
			ctx.body = {
				code: 1,
				msg: "文章已被删除,无法再次删除",
			};
		}
		return next();
	});
};