module.exports = function(seeds,Model,name) {

	return new Promise(function(resolve,reject) {
		Model.create(seeds,function(err) { 
			if(err) return reject(err)  
			return resolve();
		})

		console.log(`${name} MODEL WITH ${seeds.length} DATA CREATED SUCCESSFULLY!`);
	})
	
}