const fs = require("fs");

let json_contents = "let tokensJSON = {};\n";
let import_contents = "";
let tokenJSONMockup = {};

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
					if (!!name.match("\\." + type)) {
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

searchForType("./", "json", names => {
	const path = `"./${names.join("/")}"`;
	const varname = sanitize(names.join("_"));
	import_contents += `import ${varname} from ${path};\n`;
	
	// Add internal objects to make path exist
	let key = "tokensJSON";
	let mockup = tokenJSONMockup;
	for(let name of names) {
		key += "." + sanitize(name);
		if (sanitizer.test(name)) {
			// If name is a .json
			json_contents += `${key} = ${varname};\n`;
		} else {
			// If name is a directory
			if (!mockup[name]) {
				mockup[name] = {};
				json_contents += `${key} = {};\n`;
			}
			mockup = mockup[name];
		}
	}
}).then(() => {
	const file_contents = import_contents + json_contents + "export default tokensJSON;\n";
	fs.writeFile("./_tokens.js", file_contents, err => {
		if (err) {
			console.error(err)
			return
		}
		//file written successfully
	})
});
