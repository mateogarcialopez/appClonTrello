let noteController = {}
const noteModel = require('../models/note.model');
const userModel = require('../models/user.model');
const fs = require('fs');
const path = require('path');

//add note
noteController.addNote = async (req, res) => {
    try {

        let splitSmg = req.files.img.path.split('\\');
        let nameImg = splitSmg[splitSmg.length - 1];

        console.log(nameImg);
        const newNote = new noteModel({
            titulo: req.body.titulo,
            descripcion: req.body.descripcion,
            user: req.user._id,
            img: nameImg
        });

        let noteSaved = await newNote.save();

        if (!noteSaved) {
            return res.status(400).json({
                status: false,
                message: 'No se puedo guardar la nota'
            });
        }

        if (noteSaved) {
            return res.status(200).json({
                status: true,
                message: 'Nota almacenada',
                noteSaved
            });
        }


    } catch (error) {
        return res.status(400).json({
            status: false,
            error: error
        });
    }
}

//listar notas de usuario
noteController.getNotes = async (req, res) => {
    try {
        let notes = await noteModel.find({ user: req.user._id }).populate('user');

        if (!notes) {
            return res.status(400).json({
                status: false,
                message: 'No se puedo encontrado ninguna nota'
            });
        }

        if (notes) {
            return res.status(200).json({
                status: true,
                message: 'Notas encontradas',
                notes
            });
        }
    } catch (error) {
        return res.status(400).json({
            status: false,
            error: error
        });
    }
}

//listar nota
noteController.getNote = async (req, res) => {
    try {

        let { idnote } = req.params;
        let note = await noteModel.findOne({ _id: idnote, user: req.user._id }).populate('user');

        if (!note) {
            return res.status(400).json({
                status: false,
                message: 'No se puedo encontrado la nota'
            });
        }

        if (note) {
            return res.status(200).json({
                status: true,
                message: 'Nota encontrada',
                note
            });
        }
    } catch (error) {
        return res.status(400).json({
            status: false,
            error: error
        });
    }
}

//actualizar nota - actualizar nombre de la imagen y eliminar la antigua
noteController.updateNote = async (req, res) => {
    try {

        let { id } = req.params;
        let splitSmg = req.files.img.path.split('\\');
        let nameImg = splitSmg[splitSmg.length - 1];
        let newnote = {
            titulo: req.body.titulo,
            descripcion: req.body.descripcion,
            img: nameImg
        }

        let note = await noteModel.findById(id);


        if (!note) {
            return res.status(400).json({
                status: false,
                message: 'No se pudo encontrado la nota'
            });
        }

        if (note) {

            let img = note.img;

            if (fs.existsSync(path.join(__dirname, `../public/${img}`))) {
                fs.unlinkSync(path.join(__dirname, `../public/${img}`));
            }

            let noteUpdated = await noteModel.findByIdAndUpdate(id, newnote, { new: true, runValidators: true });

            if (!noteUpdated) {
                return res.status(400).json({
                    status: false,
                    message: 'No se pudo encontrado la nota'
                });
            }

            if (noteUpdated) {
                return res.status(200).json({
                    status: true,
                    message: 'Nota actualizada',
                    noteUpdated
                });
            }
        }



    } catch (error) {
        return res.status(400).json({
            status: false,
            error: error
        });
    }
}

//eliminar nota - eliminar la imagen de pblic
noteController.deleteNote = async (req, res) => {

    try {

        let { id } = req.params;

        let note = await noteModel.findById(id);


        if (!note) {
            return res.status(400).json({
                status: false,
                message: 'No se puedo encontrado la nota'
            });
        }

        if (note) {

            let img = note.img;
            let noteDeleted = await noteModel.findByIdAndRemove(id);

            if (!noteDeleted) {
                return res.status(400).json({
                    status: false,
                    message: 'No se puedo encontrado la nota'
                });
            }

            if (noteDeleted) {

                if (fs.existsSync(path.join(__dirname, `../public/${img}`))) {
                    fs.unlinkSync(path.join(__dirname, `../public/${img}`));
                }
                return res.status(200).json({
                    status: true,
                    message: 'Nota eliminada',
                    noteDeleted
                });
            }

        }


    } catch (error) {
        return res.status(400).json({
            status: false,
            error: error
        });
    }
}

module.exports = noteController;