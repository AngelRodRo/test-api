var normalizedPath = require("path").join(__dirname, "/generators");
var fs = require("fs");
var mongoose = require('mongoose');
var config = require('../../config/config');

var db = config.dbquery;

mongoose.connect(db,function (err) {
	mongoose.connection.db.dropDatabase();
	console.log("DB CLEAR SUCCESFULLY!");
	var seeders = [];
	fs.readdirSync(normalizedPath).forEach(function(file) {
		if(file[0]!==".")  seeders.push(require("./generators/" + file));		
	});
	Promise.all(seeders).then(function(res) {
			process.exit()
		}).catch(reason => { 
		  console.error(reason)
		})
});

var init = function(){
	mongoose.connection.db.dropDatabase();
	console.log("DB CLEAR SUCCESFULLY!");

	var seeders = [];
	fs.readdirSync(normalizedPath).forEach(function(file) {
		if(file[0]!==".")  seeders.push(require("./generators/" + file));		
	});
	console.log(seeders);
	return Promise.all(seeders);
}

module.exports = init;
