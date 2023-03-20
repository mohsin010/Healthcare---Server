const morgan = require('morgan');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const ipfsClient = require('ipfs-http-client');



module.exports = function () {
    const server = express(); let create; let start;

    create = function (config) {
        const routes = require('./routes');
        // server setting
        server.set('port', config.port);
        server.set('hostname', config.hostname);

        server.use(bodyParser.json());

        server.use(morgan('dev'));

        server.use(cors());

        server.use('/upload', express.static('static/upload'));

        server.use('/', routes);
        // server.use(IPFS)

        server.use((reqs, res) => {
            res.status(404).send('not found');
        })
    }

    start = function () {
        const hostname = server.get('hostname');
        const port = server.get('port');

        var uri = 'mongodb://localhost:27017/medichain'
        const client = mongoose.connect(uri, {
            useNewUrlParser: true,
        })

        // mongoose.set('useFindAndModify', false);
        mongoose.set('debug', true);
        mongoose.Promise = global.Promise;

        const db = mongoose.connection;

        db.on('error', console.error.bind(console, 'MongoDB connection Error'));

        db.once('open', async () => {
            console.log('DB is Successfully Connected');
            server.listen(port, () => {
                console.log(`DB is connected Successfully && server started at http://${hostname}:${port}`)
            });
        });
        new ipfsClient.create({ host: 'localhost', port: '5001', protocol: 'http' });
        // const ipfs = new IPFS({ host: 'https://ipfs.infura.io:5001', port: 5001, protocol: 'http' });
        // const ipfs = new IPFS();
        // console.log(ipfs)
        // console.log("IPFS is Successfully Connected");

    };

    unhandledRoutes = function () {
        server.use((req, res, next) => {
            const error = new Error('Undefined route');
            error.status = 404;
            next(error);
        });
        server.use((error, req, res, next) => {
            res.status(error.status || 500)
        });
    };

    return { create, start };


};