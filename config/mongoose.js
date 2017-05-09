var mongoose = require("mongoose");
var fs = require("fs");

mongoose.connect(process.env.heroku_s34n8lc3:h92utn9uf7shm2c1riuei4026f@ds133221.mlab.com:33221/heroku_s34n8lc3);
// mongoose.connect("mongodb://localhost/discussion_board3");

var models_path = __dirname + "/../server/models";

fs.readdirSync(models_path).forEach(function(file) {
	if(file.indexOf(".js") > 0 ) {
		require(models_path + "/" + file);
	}
});
