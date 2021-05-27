const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

app.get("/", (req, res) => {
    res.send("Serwer do kalendarza");
});

const file_path = "./data.json";

app.get("/notes", (req, res) => {
    fs.readFile(file_path, "utf8", (err, dataJson) => {
        if (err) {
            console.log(`File read failed in GET /notes: ${err}`);
            res.status(500).send("File read failed");
            return;
        }
        var data = JSON.parse(dataJson);
        var notes = data.Notes;
        console.log(`GET: /notes`);
        res.send(notes);
    });
});

app.get("/notes/:id", (req, res) => {
    fs.readFile(file_path, "utf8", (err, dataJson) => {
        if (err) {
            console.log(`File read failed in GET /notes/${req.params.id}: ${err}`);
            res.status(500).send(`File read failed`);
            return;
        }
        var data = JSON.parse(dataJson);
        var noteBody = data.Notes.find((n) => n.id == req.params.id);
        if (!noteBody) {
            console.log(`GET: /notes/${req.params.id} not exists`);
            res.status(500).send(`Note with id = ${req.params.id} not found`);
        }
        console.log(`GET: /notes/${noteBody.id}`);
        res.send(noteBody);
    });
});


app.post("/notes", (req, res) => {
    fs.readFile(file_path, "utf8", (err, dataJson) => {
        if (err) {
            console.log(`File read failed in POST /notes: ${err}`);
            res.status(500).send(`File read failed`);
            return;
        }
        var data = JSON.parse(dataJson);
        var note = data.Notes.find((n) => n.id == req.body.id);
        if (note) {
            console.log(`Note with id = ${req.body.id} already exists`);
            res
                .status(500)
                .send(`Note with id = ${req.body.id} already exists`);
            return;
        }
        data.Notes.push(req.body);
        var newList = JSON.stringify(data);
        fs.writeFile(file_path, newList, (err) => {
            if (err) {
                console.log(`Error writing file in POST /notes: ${err}`);
                res.status(500).send(`Error writing file data.json`);
            } else {
                res.status(201).send(req.body);
                console.log(`Successfully wrote file with data and added new note with id = ${req.body.id}`);
            }
        });
    });
});

app.put("/notes/:id", (req, res) => {
    fs.readFile(file_path, "utf8", (err, dataJson) => {
        if (err) {
            console.log(
                `File read failed in PUT /notes/${req.params.id}: ${err}`);
            res.status(500).send(`File read failed`);
            return;
        }
        var data = JSON.parse(dataJson);
        var noteBody = data.Notes.find((n) => n.id == req.body.id);

        if (noteBody && noteBody.id != req.params.id) {
            console.log(`Note by id = ${noteBody.id} already exists`);
            res
                .status(500)
                .send(`Note by id = ${noteBody.id} already exists`);
            return;
        }
        var note = data.Notes.find((n) => n.id == req.params.id);
        if (!note) {
            data.Notes.push(req.body);
            var newList = JSON.stringify(data);
            fs.writeFile(file_path, newList, (err) => {
                if (err) {
                    console.log(
                        `Error writing file in PUT /notes/${req.params.id}: ${err}`
                    );
                    res.status(500).send(`Error writing file data.json`);
                } else {
                    res.status(201).send(req.body);
                    console.log(
                        `Successfully wrote file data.json and added new note with id = ${req.body.id}`
                    );
                }
            });
        } else {
            var idx = data.Notes.findIndex((n) => n.id == req.params.id);
            data.Notes[idx] = req.body;
            var newList = JSON.stringify(data);
            fs.writeFile(file_path, newList, (err) => {
                if (err) {
                    console.log(
                        `Error writing file in PUT /notes/${req.params.id}: ${err}`
                    );
                    res.status(500).send(`Error writing file data`);
                } else {
                    res.status(201).send(req.body);
                    console.log(
                        `Successfully wrote file data and edit notes with old id = ${req.params.id}`
                    );
                }
            });
        }
    });
});

app.delete("/notes/:id", (req, res) => {
    fs.readFile(file_path, "utf8", (err, dataJson) => {
        if (err) {
            console.log(`File read failed in DELETE /notes: ${err}`);
            res.status(500).send(`File read failed`);
            return;
        }
        var data = JSON.parse(dataJson);
        var idx = data.Notes.findIndex(
            (n) => n.id == req.params.id
        );

        if (idx != -1) {
            data.Notes.splice(idx, 1);
            var newList = JSON.stringify(data);
            fs.writeFile(file_path, newList, (err) => {
                if (err) {
                    console.log(
                        `Error writing file in DELETE /notes/${req.params.id}: ${err}`);
                    res.status(500).send(`Error writing file data.json`);
                } else {
                    res.status(204).send();
                    console.log(`Successfully deleted note with id = ${req.params.id}`);
                }
            });
        } else {
            console.log(`Note by id = ${req.params.id} does not exists`);
            res
                .status(500)
                .send(`Note by id = ${req.params.id} does not exists`);
            return;
        }
    });
});

app.listen(8002, () => console.log("Server address http://localhost:8002"));