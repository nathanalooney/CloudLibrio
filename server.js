var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var COMMENTS_FILE = path.join(__dirname, 'comments.json');

app.set('port', (process.env.PORT || 3000));

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
console.log(__dirname);
console.log(require('fs').readdirSync(__dirname));


app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});