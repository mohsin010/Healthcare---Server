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
    title: {
        type: String, 
        required: false,
    },
    description: {
        type: String, 
        required: false,
    },
    filename: {
        type: String,    
        required: true
    },
    key: {
        type: String,    
        required: true
    },
    iv: {
        type: String,    
        required: true
    },
    ipfsHash: {
        type: String,    
        required: true
    }
});

module.exports= mongoose.model('Data', schema);