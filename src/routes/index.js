const express = require('express');
const route = express.Router();
const userController = require('../controllers/user.controller');
const noteController = require('../controllers/note.controller');
const multiparty = require('connect-multiparty');
const middlewareMultiparty = multiparty({ uploadDir: './src/public' });
const { verifiToken } = require('../middlewares/verifyToken');
const { Router } = require('express');
const path = require('path');
const multer = require('multer');
const uuid = require('uuid/v4');
const storage = multer.diskStorage({
    destination: path.join(__dirname, '../public'),
    filename: (req, file, cb) => {
        cb(null, uuid() + path.extname(file.originalname)); //uuid is module that generate strings random
    }
});
const upload = multer({ storage });

//users
route.get('/prueba', [verifiToken], userController.prueba);
route.post('/addUser', userController.addUser);
route.get('/getUser/:id', [verifiToken], userController.getUser);
route.get('/getUsers', [verifiToken], userController.getUsers);
route.put('/updateUser/:id', [verifiToken], userController.updateUser);
route.delete('/deleteUser/:id', [verifiToken], userController.deleteUser);
route.put('/desactivateUser/:id', [verifiToken], userController.desactivateUser);
route.post('/login', userController.login);
route.get('/loginGoogle', userController.google);

//notes
route.post('/addNote', [upload.single('img'), verifiToken], noteController.addNote);
route.get('/getNotes', [verifiToken], noteController.getNotes);
route.get('/getNote/:idnote', [verifiToken], noteController.getNote);
route.post('/updateNote/:id', [verifiToken, upload.single('img')], noteController.updateNote);
route.delete('/deleteNote/:id', [verifiToken], noteController.deleteNote);

module.exports = route;