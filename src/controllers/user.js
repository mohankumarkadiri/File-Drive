const userModel = require('../models/user');

const fetchCurrentUserDetails = (req, res) => res.status(200).send(req.user);

const fetchUsers = async (_, res) => {
    try {
        const users = await userModel.find({}).lean();
        return res.status(200).send(users);
    } catch (error) {
        return res.status(500).send({ message: error });
    }
}


module.exports = {
    fetchCurrentUserDetails,
    fetchUsers
}