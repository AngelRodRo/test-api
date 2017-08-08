var normalizedPath = require("path").join(__dirname, "/generators");
var fs = require("fs");
var mongoose = require('mongoose');
var config = require('../../config/config');

var db = config.dbquery;

mongoose.connect(db,function (err) {
	mongoose.connection.db.dropDatabase();
	console.log("DB CLEAR SUCCESFULLY!");
	fs.readdirSync(normalizedPath).forEach(function(file) {

		var seeders = [];
		if(file[0]!==".")  seeders.push(require("./generators/" + file));

		Promise.all(seeders).then(function(res) {
			process.exit()
		}).catch(reason => { 
		  console.error(reason)
		})
	});
});