const DeviceModel =  require('../models/device');


class DeviceService {

    saveDevice(request) {
        return new DeviceModel(request).save();
    }
    deleteDevice(request) {
        return DeviceModel.findOneAndDelete(request);
    }
    getAllDevices(request) {
        return DeviceModel.find(request);
    }
    getOneDevice(request) {
        return DeviceModel.findOne(request);
    }
}

module.exports = new DeviceService();  