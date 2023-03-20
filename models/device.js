const mongoose = require('mongoose');

var schema = new mongoose.Schema({
    orgname: {
        type: String,
        required: false
    },
    name: {
        type: String,
        required: false,
    },
    macAddress: {
        type: String,
        required: false,
    },
    edgeId: {
        type: String,
        required: false,
    }
});

module.exports = mongoose.model('device', schema);