const Data =  require('../models/data');


class DataService {

    storeData(request) {
        return new Data(request).save();
    }
    getOneData(request) {
        return Data.findOne(request);
    }
    getOwnData(request) {
        return Data.find();
    }
}

module.exports = new DataService();  