const fs = require("fs");
const path = require("path");

module.exports = async function walkDir (dirPath, cb, accepts) {
	if (!fs.existsSync(dirPath)) {
		return;
	}

	const acceptsType = typeof accepts;

	if (accepts &&
		(acceptsType !== "string"
			&& acceptsType !== "object")) {
		console.error("walkDir accepts's type only can be {string or array}");
		return;
	}

	fs
		.readdirSync(dirPath)
		.forEach(filename => {
			const ext = path.extname(filename);
			const filePath = dirPath + "/" + filename;
			const stat = fs.statSync(filePath);
			if (stat.isDirectory()) {
				walkDir(filePath, cb, accepts);
			} else {
				if ((acceptsType === "string" && accepts === ext)
					|| ((Array.isArray(accepts)) && accepts.includes(ext))
					|| !accepts) {
					cb(filePath);
				}
			}
		});
};