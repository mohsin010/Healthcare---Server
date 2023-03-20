const AdminService = require('../../services/admin.js');
const apiError = require('../../common/api-errors');
const messages = require('../../common/messages');
const ResponseService = require('../../common/response');
const bcrypt = require('bcryptjs');
const { urlencoded } = require('body-parser');


class AuthController {
    async signup(req, res) {
        try {
            let request = Object.assign({}, req.body);
            request.username = request.username.toLowerCase();
            request.orgname = request.orgname.toLowerCase();
            var salt = bcrypt.genSaltSync(10);
            var pwdhash = bcrypt.hashSync(request.password, salt);
            request.password = pwdhash;
            let admin = AdminService.createAdmin(request);
            return res.status(200).send(ResponseService.success(admin));
        } catch (e) {
            return res.status(e.code || 500).send(ResponseService.failure(e));
        }
    }

    async login(req, res) {
        try {

            let request = Object.assign({}, req.body.data);

            if (!request.username || !request.password || !request.orgname) throw new apiError.ValidationError('Parameter is missing', messages.USERNAME_REQUIRED)
            request.username = request.username.toLowerCase();
            request.orgname = request.orgname.toLowerCase();

            let user

            user = await AdminService.getAdmin({ 'username': request.username, orgname: request.orgname});
            if (!user) throw new apiError.UnauthorizedError(messages.USER_NOT_FOUND);

            let matchBcrypt = await bcrypt.compareSync(request.password, user.password);

            if (!matchBcrypt) throw new apiError.UnauthorizedError(messages.USERNAME_OR_PASSWORD_INVALID);
            
            user.password  = null;
            return res.status(200).send(ResponseService.success(user));

        } catch (e) {
            return res.status(e.code || 500).send(ResponseService.failure(e));
        }

    }
}

module.exports = new AuthController();