const DeviceService = require('../../services/device');
const AdminService = require('../../services/admin');
const apiError = require('../../common/api-errors');
const messages = require('../../common/messages');
const ResponseService = require('../../common/response');


class DeviceController {
    async registerDevice(req, res) {
        try {
            let request = Object.assign({}, req.body);

            // Authenticate the admin
            let admin = await AdminService.getAdmin({ username: request.username, orgname: request.orgname })
            if (!admin) throw new apiError.NotFoundError('admin', messages.USER_NOT_FOUND)
            let device = await DeviceService.getOneDevice({ macAddress: request.macAddress });
            if (device) throw new apiError.ResourceAlreadyExistError('device', messages.DEVICE_MAC_ALREADY_EXISTS);
            let data = {
                orgname: admin.orgname,
                name: request.name,
                macAddress: request.macAddress,
                edgeId: request.edgeId
            }
            let saveDevice = await DeviceService.saveDevice(data);
            if (!saveDevice) throw new apiError.InternalServerError('device', messages.DATABASE_ERROR)

            const getAllDevices = await DeviceService.getAllDevices({ orgname: admin.orgname });
            return res.status(200).send(ResponseService.success(getAllDevices));

        } catch (e) {
            return res.status(500).send(ResponseService.failure(e));
        }

    }

    async getAllDevices(req, res) {
        try {
            let request = Object.assign({}, req.body);
            // Authenticate the admin
            let admin = await AdminService.getAdmin({ username: request.username, orgname: request.orgname })
            if (!admin) throw new apiError.NotFoundError('admin', messages.USER_NOT_FOUND)

            const getAllDevices = await DeviceService.getAllDevices({ orgname: admin.orgname });
            if (!getAllDevices) throw new apiError.NotFoundError('device', messages.DATA_NOT_FOUND)

            return res.status(200).send(ResponseService.success(getAllDevices));

        } catch (e) {
            return res.status(500).send(ResponseService.failure(e));
        }

    }

    async deleteDevice(req, res) {
        try {
            let request = Object.assign({}, req.body);
            // Authenticate the admin
            let admin = await AdminService.getAdmin({ username: request.username, orgname: request.orgname });
            if (!admin) throw new apiError.NotFoundError('admin', messages.USER_NOT_FOUND);

            const deleteDevice = await DeviceService.deleteDevice({ _id: request.id });
            if (!deleteDevice) throw new apiError.NotFoundError('device', messages.DATA_NOT_FOUND)

            const getAllDevices = await DeviceService.getAllDevices({ orgname: admin.orgname });

            return res.status(200).send(ResponseService.success(getAllDevices));
            // return res.status(200).send(ResponseService.success(encryptInfo));
        } catch (e) {
            return res.status(500).send(ResponseService.failure(e));
        }

    }
}
module.exports = new DeviceController();