const fs = require("fs");
const path = require("path");
const dataListPath = path.join(__dirname, "./dataList.json");
let db = JSON.parse(fs.readFileSync(dataListPath, {encoding: "utf-8"}));

function writeDb () {
	fs.writeFileSync(dataListPath, JSON.stringify(db));
}

module.exports = jdb = {
	createTab (name) {
		db[name] = [];
		writeDb();
	},
	deleteTab (name) {
		db[name] = null;
		writeDb();
	},
	selectTab (name) {
		const tab = db[name];
		if (tab) {
			return tab;
		} else {
			console.error("tab does't not exist");
			return null;
		}
	},
	existTab (name) {
		return !!db[name];
	},
	modifyTab (data, name) {
		db[name] = data;
		writeDb();
	},
}
;