var express = require('express');
var app = express();

app.use('/v1', require('./routes'));
app.get('/', function(req, res) {
    res.send('app started')
});

const port = 4000;
app.listen(port, () => console.log(`listening on port ${port}`));