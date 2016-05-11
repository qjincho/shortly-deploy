var app = require('./server-config.js');

app.set('port', process.env.PORT || 8080);

app.listen(port);

console.log('Server now listening on port ' + port);
