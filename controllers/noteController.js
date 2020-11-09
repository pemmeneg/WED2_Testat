import {noteService} from '../services/noteService.js';

let data = {title : '', notes : {}, userSettings: {}};

function home(req, res) {
    renderAll(req, res);
}

function newNote(req, res) {
    const newNote = {title : 'Create new Note',  note : {id : 0, title : '', finished : "", content : '', importance : '0', deadline : ''}, userSettings: {theme : req.session.userSettings.theme}};
    res.render('editNote', newNote);
}

function createNote(req, res) {
        const id = req.body._id;
        const created = new Date(Date.now()).toISOString();
        const title = req.body.title;
        const content = req.body.content;
        const importance = req.body.importance;
        const deadline = req.body.deadline;
        let finished = "";
        if(req.body.finished != undefined) {
            finished = "checked";
        }

        if(id === '') {
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
        const receivedNote = {title : 'Edit Note', note : note, userSettings: {theme : req.session.userSettings.theme}};
        res.render('editNote', receivedNote);
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

async function renderAll(req, res) {
    const orderBy = req.session.userSettings.orderBy;
    const orderDirection = req.session.userSettings.orderDirection;
    const displayFinished = req.session.userSettings.displayFinished;
    const theme = req.session.userSettings.theme;
    let sorting = {finishdate: false, createddate: false, importance: false, asc : true};
    switch(orderBy) {
        case 'finishdate':
            sorting.finishdate = true;
            break;
        case 'createddate':
            sorting.createddate = true;
            break;
        case 'importance':
            sorting.importance = true;
            break;
    }
    orderDirection > 0 ? sorting.asc = true : sorting.asc = false;

    noteService.all(orderBy, orderDirection, displayFinished, function(err, notes) {
        let now = Date.now();
        for(let note of notes) {
            let deadline = Date.parse(note.deadline);
            let delta =  (deadline - now) / 1000;
            let remaining = "-";
            if(delta < 0) {
                note.overdue = true;
            } else {
                note.overdue = false;
                var days = Math.floor(delta / 86400);
                delta -= days * 86400;

                var hours = Math.floor(delta / 3600) % 24;
                delta -= hours * 3600;
                if(days < 1) {
                    remaining = hours + " hours";
                } else {
                    remaining = days + " days";
                }
            }
            note.remaining = remaining;
            if(note.finished === "checked") {
                note.finished = true;
            }
        }
        data = {title : 'Notes', notes : notes, userSettings : req.userSettings, sorting: sorting}

        res.render('home', data);
    });
}
export {home, newNote, createNote, getNote, editNote};