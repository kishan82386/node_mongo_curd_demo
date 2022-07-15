const wordpressHash = require("wordpress-hash-node");
const userService = require("../service/userService");
const Auth = require('../middleware/auth');
const pick = require('../utils/pick');

const userSignUP = async (req, res) => {
    try {
        const getUserByEmail = await userService.getUserByEmail(req.body.email);
        if (getUserByEmail) {
            return res.status(400).json({
                success: false,
                data: null,
                message: "User email address exists",
            });
        }


        req.body.password = wordpressHash.HashPassword(req.body.password);
        const createUser = await userService.createUser(req.body);
        console.log("createUser :>> ", createUser);
        return res.status(201).json({
            success: true,
            data: createUser,
            message: "User created successfully.",
        });
    } catch (error) {
        console.log("error.message :>> ", error.message);
        return res.status(500).json({
            success: false,
            data: null,
            message: error.message,
        });
    }
};

const logIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        const getUser = await userService.getUserByEmail(email);

        if (getUser) {
            const comparePassword = wordpressHash.CheckPassword(
                password,
                getUser.password
            );

            if (comparePassword) {
                const paylod = {
                    firstName: getUser.firstName,
                    lastName: getUser.lastName,
                    email: getUser.email,
                    password: getUser.password,
                    dob: getUser.dob,
                    gender: getUser.gender,
                }

                const token = Auth.encodeJwt(paylod);
                const updateQuery = {
                    _id: getUser._id,
                };
                await userService.updateUser(updateQuery);
                return res.status(200).json({
                    success: true,
                    data: { token, },
                    message: "LoggedIn Successfully.",
                });

            } else {
                return res.status(400).json({
                    success: false,
                    data: null,
                    message: "password does not match!  plese enter valid password."
                })
            };
        } else {
            return res.status(400).json({
                success: false,
                data: null,
                message: "User not found! plese enter valid  email."
            })
        }
    } catch (error) {
        console.log("error.message :>> ", error.message);
        return res.status(500).json({
            success: false,
            data: null,
            message: error.message,
        });
    }
}

const getAllUser = async (req, res) => {
    try {
        const { filter } = pick(req.query, ['filter', 'filter'])

        // const { option } = pick(req.query, ['sortBy', 'limit', 'page']);
        const query = {
            $and: [{ addedBy: req.user._id }],
        }
        if (!filter) {

        } else {
            query.$and.push({
                $or: [
                    {
                        firstName: { $regex: `${filter}`, $options: 'i' }
                    },
                    {
                        lastName: { $regex: `${filter}`, $options: 'i' }
                    },
                    {
                        email: { $regex: `${filter}`, $options: 'i' }
                    },
                    // {
                    //     dob: { $regex: `${filter}`, $options: 'i' }
                    // },
                    {
                        gender: { $regex: `${filter}`, $options: 'i' }
                    },
                ]
            })
        }

        const getUser = await userService.getAllUserQuery(query)
        return res.status(200).json({
            success: true,
            data: getUser,
            message: "all user"

        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: null,
            message: error.message,
        })
    }
}

const ownUserSignUP = async (req, res) => {
    try {
        const getUserByEmail = await userService.getUserByEmail(req.body.email);
        if (getUserByEmail) {
            return res.status(400).json({
                success: false,
                data: null,
                message: "User email address exists",
            });
        }

        req.body.addedBy = req.user._id
        req.body.password = wordpressHash.HashPassword(req.body.password);
        const createUser = await userService.createUser(req.body);
        console.log("createUser :>> ", createUser);
        return res.status(201).json({
            success: true,
            data: createUser,
            message: "User created successfully.",
        });
    } catch (error) {
        console.log("error.message :>> ", error.message);
        return res.status(500).json({
            success: false,
            data: null,
            message: error.message,
        });
    }
};

const getById = async (req, res) => {
    try {
        const { id } = req.params;
        const query = {
            _id: id,
        }

        console.log(query);
        const getUser = await userService.getAllUserQuery(query)
        console.log(getUser);
        return res.status(200).json({
            success: true,
            data: getUser,
            message: "User found successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            data: null,
            message: error.message
        })

    }
}

const updateUserOwnuser = async (req, res) => {
    try {
        const { id } = req.params;
        const query = {
            _id: id,
        }
        const getUser = await userService.getUserQuery(query);
        if (getUser) {
            const updateOwnuser = await userService.updateUser(query, req.body)
            return res.status(200).json({
                success: true,
                data: getUser,
                message: "User update successfully"
            })
        } else {
            return res.status(400).json({
                success: false,
                data: null,
                message: "User not found"
            })

        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: null,
            message: error.message
        })

    }
}

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        // const query = {
        //     _id: id
        // }
        const getUser = await userService.removeUser(id)
        if (getUser.deletedCount > 0) {
            return res.status(200).json({
                success: true,
                data: getUser,
                message: "user deleted successfully"
            });
        } else {
            return res.status(400).json({
                success: false,
                data: null,
                message: "some thing want wrong"
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: null,
            message: error.message
        })

    }
}

const createOwnBulkUser = async (req, res) => {
    try {
        const { data } = req.body;
        let existEmailUser = [];
        let createdUserArry = [];
        if (data.length > 0) {
            for (let i = 0; data.length > i; i++) {
                const getUserByEmail = await userService.getUserByEmail(data[i].email);

                if (getUserByEmail) {
                    existEmailUser.push(data[i].email);
                } else {
                    const createObject = {
                        firstName: data[i].firstName,
                        lastName: data[i].lastName,
                        email: data[i].email,
                        password: wordpressHash.HashPassword(data[i].password),
                        dob: data[i].dob,
                        gender: data[i].gender,
                        addedBy: req.user._id
                    }
                    const createBulkOwnUser = await userService.createUser(createObject);
                    if (createBulkOwnUser) {
                        createdUserArry.push(createBulkOwnUser);
                    }
                }
            }
            res.status(201).json({
                success: true,
                data: {
                    existEmailUser,
                    createdUserArry
                },
                message: "Bulk user created successfully"
            })
        } else {
            return res.status(500).json({
                success: false,
                data: null,
                message: "plese provide atleast one user"
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: null,
            message: error.message
        });
    }
}

module.exports = {
    userSignUP,
    logIn,
    getAllUser,
    ownUserSignUP,
    getById,
    updateUserOwnuser,
    deleteUser,
    createOwnBulkUser

};

