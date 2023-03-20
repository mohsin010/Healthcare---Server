const mongoose = require('mongoose');

var schema = new mongoose.Schema({
    orgname: {
        type: String,
        required: false
    },
    username: {
        type: String,  
        required: false,
    },
    password: {
        type: String,
        required: false
    }
});

module.exports= mongoose.model('Admin', schema);