import Datastore from 'nedb';
const db = new Datastore({ filename: "./public/data/note.db", autoload: true });
class Note {
    constructor(title, content, importance, deadline, finished, created) {
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
    add(title, content, importance, deadline, finished, created, callback) {
        let note = new Note(title, content, importance, deadline, finished, created);
        db.insert(note, function (err, newDoc) {
            if (callback) {
                callback(err, newDoc);
            }
        });
    }
    edit(id, title, content, importance, deadline, finished, callback) {
        db.update({ _id: id }, { $set: { "title": title, "content": content, "importance": importance, "deadline": deadline, "finished": finished } }, { returnUpdatedDocs: true }, function (err, numReplaced) {
            callback(err, numReplaced);
        });
    }
    get(id, callback) {
        db.findOne({ _id: id }, function (err, doc) {
            callback(err, doc);
        });
    }
    all(orderBy, orderDirection, displayFinished, callback) {
        let sortQuery = { "created": -1 };
        let query = {};
        if (!displayFinished) {
            query = { "finished": "" };
        }
        switch (orderBy) {
            case "default":
                sortQuery = { "created": orderDirection };
                break;
            case "finishdate":
                sortQuery = { "deadline": orderDirection };
                break;
            case "createddate":
                sortQuery = { "created": orderDirection };
                break;
            case "importance":
                sortQuery = { "importance": orderDirection };
                break;
        }
        //@ts-ignore
        db.find(query).sort(sortQuery).exec(function (err, docs) {
            console.log(docs);
            for (let note of docs) {
                //let importance = Array(note.importance);
                let importance = note.importance;
                note.importance = [];
                for (let i = 0; i < importance; i++) {
                    note.importance.push("*");
                }
            }
            callback(err, docs);
        });
    }
}
export const noteService = new NoteStore();
