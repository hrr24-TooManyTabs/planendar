var app = require('./server-config.js');
const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log('Server listening on ' + port);
});
