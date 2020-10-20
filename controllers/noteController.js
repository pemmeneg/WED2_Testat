import {noteService} from '../services/noteService.js';
import qs from 'qs';

let data = {title : '', notes : {}, userSettings: {}};

function home(req, res) {
    renderAll(req, res);
}

function newNote(req, res) {
    res.render('editNote', {title : 'Create new Note', note : {id : 0, title : '', finished : '', content : '', importance : '0', deadline : ''}});
}

function createNote(req, res) {
        const id = req.body._id;
        const created = new Date(Date.now()).toISOString();
        const title = req.body.title;
        const content = req.body.content;
        const importance = req.body.importance;
        const deadline = req.body.deadline;
        let finished;
        if(req.body.finished != undefined) {
            finished = 'checked';
        } else {
            finished = '';
        }

        if(id == '') {
            noteService.add(title, content, importance, deadline, finished, created, function(err, note) {
                renderAll(req,res);
            });
        } else {
            noteService.edit(id, title, content, importance, deadline, finished, function (err, numReplaced) {
                renderAll(req,res);
            });
        }

}

function getNote(req, res) {
    noteService.get(req.query.id, function (err, note) {
        console.log(note);
        data = {title : 'Edit Note', note : note, userSettings: {theme : req.session.userSettings.theme}};
        res.render('editNote', data);
    });
}

function editNote(req, res) {
    const id = req.body._id;
    const title = req.body.title;
    const content = req.body.content;
    const importance = req.body.importance;
    const finished = req.body.finished;

    noteService.edit(id, title, content, importance, finished, false,function (err, note) {
        renderAll(req, res);
    });
}

function renderAll(req, res) {
    const orderBy = req.session.userSettings.orderBy;
    const orderDirection = req.session.userSettings.orderDirection;
    const displayFinished = req.session.userSettings.displayFinished;
    const theme = req.session.userSettings.theme;
    noteService.all(orderBy, orderDirection, displayFinished,function(err, notes) {
        data = {title : 'Notes', notes : notes, userSettings : req.userSettings}
        res.render('home', data);
    });
}

export {home, newNote, createNote, getNote, editNote};