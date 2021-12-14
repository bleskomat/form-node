const _ = require('underscore');
const fs = require('fs');
const partialsDir = require('./partialsDir');
const path = require('path');

module.exports = function(handlebars) {
	const files = fs.readdirSync(partialsDir);
	_.chain(files).filter(function(file) {
		return path.extname(file) === '.html';
	}).each(function(file) {
		const filePath = path.join(partialsDir, file);
		const name = path.basename(file, '.html');
		const contents = fs.readFileSync(filePath);
		handlebars.registerPartial(name, contents.toString());
	});
};
