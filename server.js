var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

process.env.PWD = process.cwd();

app.set('port', (process.env.PORT || 3000));

app.use(express.static(path.join(process.env.PWD, '/public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


app.listen(app.get('port'), '0.0.0.0', function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});