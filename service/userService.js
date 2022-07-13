
const User = require("../model/user.model");
const createUser = async (userData) => {
    try {
        const createUser = User.create(userData);
        return createUser;
    } catch (error) {
        return error.message;
    }
};

const getUserByEmail = async (email) => {
    try {
        const getUserByEmail = User.findOne({ email });
        return getUserByEmail;
    } catch (error) {
        return error.message;
    }
};

const getUserQuery = async (query) => {
    try {
        const getUserQuery = User.find(query);
        return getUserQuery;
    } catch (error) {
        return error.message;
    }
}

const updateUser = async (query, data) => {
    try {
        const editUserByQuery = User.updateOne(query, { $set: data });
        return editUserByQuery;
    } catch (error) {
        return error.message;
    }
};

const getAllUserQuery = async (query) => {
    try {
        const getUserByQuery = User.find(query);
        return getUserByQuery;
    } catch (error) {
        return error.message;
    }
};

const removeUser = async (id) => {
    try {
        const getUserQuery = User.deleteOne({ _id: id });
        return getUserQuery
    } catch (error) {
        return error.message;
    }
}

module.exports = {
    createUser,
    getUserByEmail,
    getUserQuery,
    updateUser,
    getAllUserQuery,
    removeUser
};
