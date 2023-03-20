const Admin =  require('../models/admin');


class AdminService {
    getAdmin(request) {
        return Admin.findOne(request)
    }

    createAdmin(request) {
        return new Admin(request).save();
    }
}

module.exports = new AdminService();  