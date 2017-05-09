var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();
//new stuff below
var pg = require('pg');
var con = require('./connection');
var Add = mongoose.model('add', model,'user');
//new stuff above
var server = app.listen(8000, function() {
	console.log("listening on port 8000");
});
app.use(express.static(path.join(__dirname, './client')));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


//new stuff below
app.get('/db', function (request, response) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT * FROM test_table', function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.render('pages/db', {results: result.rows} ); }
    });
  });
});
//new stuff above
app.set('views', path.join(__dirname, './client'));
app.set('view engine', 'ejs');

require("./config/mongoose.js");

io = require('socket.io').listen(server);

io.sockets.on('connection', function(socket) {
	// (Listener) On Connection
 	console.log("Connected - Socket ID: ", socket.id);
  	// (Listener) On Disconnect
	socket.on('disconnect', function() {
		console.log("Disconnected - Socket ID: ", socket.id);
 	})
 	socket.on('created_topic', function(data) {
 		socket.broadcast.emit('topic_added', data);
 	})
});

require("./config/routes.js")(app);
