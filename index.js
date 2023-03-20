const server = require('./app.js')();
const config = require('./config/config.js');


server.create(config);
server.start();
