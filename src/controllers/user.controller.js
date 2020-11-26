const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { use } = require('passport');
const userController = {};
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENTID);

userController.prueba = (req, res) => {
    return res.send('qwerty pruebas');
}

userController.addUser = async (req, res) => {

    try {
        let newUser = new userModel({
            nombre_completo: req.body.nombresApellidos,
            email: req.body.email,
            contrasena: bcrypt.hashSync(req.body.contrasena, 10),
            rol: req.body.rol,
            google: req.body.google,
        });

        let userSaved = await newUser.save();

        if (!userSaved) {
            return res.status(400).json({
                status: false,
                message: 'Ocurrio un error guardando el usuario'
            });
        }

        if (userSaved) {
            return res.status(200).json({
                status: true,
                message: 'Usuario almacenado',
                user: userSaved
            });
        }

    } catch (error) {
        return res.status(400).json({
            status: false,
            message: error
        });
    }
}

//listar usuario
userController.getUser = async (req, res) => {

    try {

        let { id } = req.params;
        let user = await userModel.findById(id);

        if (!user) {
            return res.status(404).json({
                status: false,
                message: 'No se ha encontrado el usuario'
            });
        }

        if (user) {
            return res.status(200).json({
                status: true,
                message: 'Usuario encontrado',
                user: user
            });
        }

    } catch (error) {
        return res.status(400).json({
            status: false,
            message: error
        });
    }
}

userController.getUsers = async (req, res) => {
    try {
        let users = await userModel.find();

        if (!users) {
            return res.status(404).json({
                status: false,
                message: 'No se ha encontrado ningun usuario'
            });
        }

        if (users) {
            return res.status(200).json({
                status: true,
                message: 'Usuarios encontrado',
                users: users
            });
        }

    } catch (error) {
        return res.status(400).json({
            status: false,
            message: error
        });
    }
}

//update user0<
userController.updateUser = async (req, res) => {
    try {

        let { id } = req.params;
        let user = {
            nombre_completo: req.body.nombre_completo,
            email: req.body.email,
            rol: req.body.rol,
        }

        console.log(user)
        console.log(id)

        let userUpdated = await userModel.findByIdAndUpdate(id, user, { runValidators: true, new: true });

        if (!userUpdated) {
            return res.status(404).json({
                status: false,
                message: 'No se ha encontrado el usuario'
            });
        }

        if (userUpdated) {
            return res.status(200).json({
                status: true,
                message: 'Usuario actualizado',
                userUpdated: userUpdated
            });
        }

    } catch (error) {
        return res.status(400).json({
            status: false,
            message: error
        });
    }
}


//borrar usuario
userController.deleteUser = async (req, res) => {
    try {
        let { id } = req.params;

        let userDeleted = await userModel.findByIdAndDelete(id);

        if (!userDeleted) {
            return res.status(404).json({
                status: false,
                message: 'No se ha encontrado el usuario'
            });
        }

        if (userDeleted) {
            return res.status(200).json({
                status: true,
                message: 'Usuario eliminado',
                userDeleted: userDeleted
            });
        }

    } catch (error) {
        return res.status(400).json({
            status: false,
            message: error
        });
    }
}

//descativar usuario
userController.desactivateUser = async (req, res) => {
    try {
        let { id } = req.params;

        console.log(id);

        let userDeleted = await userModel.findById(id);

        if (!userDeleted) {
            return res.status(404).json({
                status: false,
                message: 'No se ha encontrado el usuario'
            });
        }

        if (userDeleted) {

            userDeleted.estado = false;

            let userDesactivated = await userDeleted.save();

            if (userDesactivated) {
                return res.status(200).json({
                    status: true,
                    message: 'Usuario desactivado',
                    userDeleted: userDeleted
                });
            }
        }

    } catch (error) {
        return res.status(400).json({
            status: false,
            message: error
        });
    }
}


//login
userController.login = async (req, res) => {
    try {
        let { email, contrasena } = req.body;

        //console.log(email);
        //console.log(contrasena);

        let emailFinded = await userModel.findOne({ email });

        if (!emailFinded) {
            return res.status(404).json({
                status: false,
                message: 'Falta el (coreo) o la contraseña'
            });
        }

        if (emailFinded) {
            if (!bcrypt.compareSync(contrasena, emailFinded.contrasena)) {
                return res.status(400).json({
                    status: false,
                    message: 'Falta el coreo o la (contraseña)'
                });
            } else {

                let token = jwt.sign({ data: emailFinded }, 'clavesecreta', { expiresIn: '48h' });

                return res.json({
                    status: true,
                    message: 'Usuario logeado correctamente',
                    user: emailFinded,
                    token: token
                });
            }
        }

    } catch (error) {
        return res.status(400).json({
            status: false,
            message: error
        });
    }
}

//Configuracion de google
async function verify(token) {
    const tikcet = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENTID
    });
    const payload = tikcet.getPayload();
    const userid = payload['sub'];

    console.log('payload', payload);
}

userController.google = async (req, res) => {


    let { authorization } = req.headers;
    verify(authorization);
}

module.exports = userController;