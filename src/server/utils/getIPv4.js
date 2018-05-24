const os = require("os");
let IPv4;

const IPs = os.networkInterfaces().en0;
for (let i = 0; i < IPs.length; i++) {
	if (IPs[i].family === 'IPv4') {
		IPv4 = IPs[i].address;
	}
}

module.exports = IPv4;