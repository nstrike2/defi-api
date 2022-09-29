const fs = require("fs");
let config = require("./_Axel_config.json");


function searchForType(path, type, callback, names = []) {
	return new Promise((resolve, reject) => {
		fs.readdir(path, {withFileTypes: true}, (err, files) => {
			let completed = new Array(files.length).fill(false);
			files.map((dirent, i) => {
				const name = dirent.name;
				const newpath = path + "/" + name;
				const newnames = [...names, name];
				if (dirent.isDirectory()) {
					searchForType(newpath, type, callback, newnames).then(() => {
						completed[i] = true;
						if (completed.every(v => v)) {
							resolve();
						}
					});
				} else {
					completed[i] = true;
					if (name.match("\\." + type)) {
						callback(newnames);
					}
				}
			});
			if (completed.every(v => v)) {
				resolve();
			}
		})
	})
}

const sanitizer = /[^_a-z]/gi;
function sanitize(name) {
	return name.replace(sanitizer,"");
}

config.tokens = {};
searchForType("./utils/tokens/", "json", names => {
	const path = `./utils/tokens/${names.join("/")}`;
	const json = require(path);
	names.reduce((obj, name) => {
		if (sanitizer.test(name)) {
			// If name is a .json
			obj[sanitize(name)] = json;
		} else {
			if (!obj[name]) {
				obj[name] = {};
			}
			return obj[name];
		}
	}, config.tokens);
}).then(() => {
	fs.writeFile("./Axel_config.json", JSON.stringify(config), () => {});
});
