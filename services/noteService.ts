import Datastore from 'nedb';
const db = new Datastore({ filename: "./public/data/note.db" , autoload: true});

class Note {
    private title : string;
    private content : string;
    private importance : string;
    private deadline : string;
    private finished : string;
    private created : string;

    constructor(title : string, content : string, importance : string, deadline : string, finished : string, created : string){
        this.title = title;
        this.content = content;
        this.importance = importance;
        this.deadline = deadline;
        this.finished = finished;
        this.created = created;
    }

    toString() {
        return `Title: ${this.title}, Content : ${this.content}, Importance : ${this.importance}, Deadline : ${this.deadline}, Finished : ${this.finished}, Created : ${this.created}`;
    }
}


class NoteStore {
    constructor() {

    }


    add(title : string, content : string, importance : string, deadline : string, finished : string, created : string, callback) {
        let note : Note = new Note(title, content, importance, deadline, finished, created);
        db.insert(note, function(err, newDoc){
            if(callback){
                callback(err, newDoc);
            }
        });
    }

    edit(id : number, title : string, content : string, importance : string, deadline : string, finished : string, callback) {
        db.update({_id: id}, {$set: {"title": title, "content" : content, "importance" : importance, "deadline" : deadline, "finished" : finished}}, {returnUpdatedDocs:true}, function (err, numReplaced) {
            callback(err, numReplaced);
        });
    }

    get(id : number, callback) {
        db.findOne({ _id: id }, function (err, doc) {
            callback( err, doc);
        });
    }

    all(orderBy : string, orderDirection : number, displayFinished : boolean , callback) {
        let sortQuery : object = {"created" : -1};
        let query : object = {};
        if(!displayFinished) {
            query = {"finished" : ""};
        }
        switch(orderBy) {
            case "default":
                sortQuery = {"created" : orderDirection};
                break;
            case "finishdate":
                sortQuery = {"deadline" : orderDirection};
                break;
            case "createddate":
                sortQuery = {"created" : orderDirection};
                break;
            case "importance":
                sortQuery = {"importance" : orderDirection};
                break;
        }
        //@ts-ignore
        db.find(query).sort(sortQuery).exec(function(err, docs) {
            for(let note of docs) {
                //let importance = Array(note.importance);
                let importance = note.importance;
                note.importance = [];
                for(let i = 0; i < importance; i++) {
                    note.importance.push("*");
                }
            }
            callback(err, docs);
        });
    }
}

export const noteService = new NoteStore();
