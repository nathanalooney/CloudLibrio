var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var COMMENTS_FILE = path.join(__dirname, 'comments.json');

app.set('port', (process.env.PORT || 3000));



app.use(express.static(__dirname + '/Public', {
	setHeaders: function(res, path, stat) {
	  res.header("Access-Control-Allow-Origin", "*");
	  res.header("Access-Control-Allow-Headers", "origin, x-requested-with, content-type, accept, accept-encoding, authorization, x-csrftoken, accept-language");
	  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
	}
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});