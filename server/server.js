require('dotenv').config();
const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require('jsonwebtoken');
const app = express();
const utils = require('./utils');
const storage = require('./storage');
const file_path = "./data.json";

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

//In all future routes, this helps to know if the request is authenticated or not.
app.use(function (req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.headers['authorization'];
    if (!token) return next(); //if no token, continue

    token = token.replace('Bearer ', '');
    jwt.verify(token, process.env.JWT_SECRET, function (err, user) {
        if (err) {
            return res.status(401).json({
                error: true,
                message: "Invalid user."
            });
        } else {
            req.user = user; //set the user to req so other routes can use it
            next();
        }
    });
});

app.get("/", (req, res) => {
    if (!req.user) return res.status(401).json({ success: false, message: 'Invalid user to access it.' });
    res.send(`Witaj na serwer do kalendarza ${req.user.name}`);
});

// NOTES CRUD
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

// CATEGORIES CRUD
app.get("/categories", (req, res) => {
    fs.readFile(file_path, "utf8", (err, dataJson) => {
        if (err) {
            console.log(`File read failed in GET /categories: ${err}`);
            res.status(500).send("File read failed");
            return;
        }
        var data = JSON.parse(dataJson);
        var categories = data.Categories;
        console.log(`GET: /categories`);
        res.send(categories);
    });
});

app.get("/categories/:id", (req, res) => {
    fs.readFile(file_path, "utf8", (err, dataJson) => {
        if (err) {
            console.log(`File read failed in GET /categories/${req.params.id}: ${err}`);
            res.status(500).send(`File read failed`);
            return;
        }
        var data = JSON.parse(dataJson);
        var categoryBody = data.Categories.find((c) => c.id == req.params.id);
        if (!categoryBody) {
            console.log(`GET: /categories/${req.params.id} not exists`);
            res.status(500).send(`Category with id = ${req.params.id} not found`);
        }
        console.log(`GET: /categories/${categoryBody.id}`);
        res.send(categoryBody);
    });
});


app.post("/categories", (req, res) => {
    fs.readFile(file_path, "utf8", (err, dataJson) => {
        if (err) {
            console.log(`File read failed in POST /categories: ${err}`);
            res.status(500).send(`File read failed`);
            return;
        }
        var data = JSON.parse(dataJson);
        var category = data.Categories.find((c) => c.id == req.body.id);
        if (category) {
            console.log(`Category with id = ${req.body.id} already exists`);
            res
                .status(500)
                .send(`Category with id = ${req.body.id} already exists`);
            return;
        }
        data.Categories.push(req.body);
        var newList = JSON.stringify(data);
        fs.writeFile(file_path, newList, (err) => {
            if (err) {
                console.log(`Error writing file in POST /categories: ${err}`);
                res.status(500).send(`Error writing file data.json`);
            } else {
                res.status(201).send(req.body);
                console.log(`Successfully wrote file with data and added new category with id = ${req.body.id}`);
            }
        });
    });
});

app.put("/categories/:id", (req, res) => {
    fs.readFile(file_path, "utf8", (err, dataJson) => {
        if (err) {
            console.log(
                `File read failed in PUT /categories/${req.params.id}: ${err}`);
            res.status(500).send(`File read failed`);
            return;
        }
        var data = JSON.parse(dataJson);
        var categoryBody = data.Categories.find((c) => c.id == req.body.id);

        if (categoryBody && categoryBody.id != req.params.id) {
            console.log(`Category with id = ${categoryBody.id} already exists`);
            res
                .status(500)
                .send(`Category with id = ${categoryBody.id} already exists`);
            return;
        }
        var category = data.Categories.find((c) => c.id == req.params.id);
        if (!category) {
            data.Categories.push(req.body);
            var newList = JSON.stringify(data);
            fs.writeFile(file_path, newList, (err) => {
                if (err) {
                    console.log(
                        `Error writing file in PUT /categories/${req.params.id}: ${err}`
                    );
                    res.status(500).send(`Error writing file data.json`);
                } else {
                    res.status(201).send(req.body);
                    console.log(
                        `Successfully wrote file data.json and added new category with id = ${req.body.id}`
                    );
                }
            });
        } else {
            var idx = data.Categories.findIndex((n) => n.id == req.params.id);
            data.Categories[idx] = req.body;
            var newList = JSON.stringify(data);
            fs.writeFile(file_path, newList, (err) => {
                if (err) {
                    console.log(
                        `Error writing file in PUT /categories/${req.params.id}: ${err}`
                    );
                    res.status(500).send(`Error writing file data`);
                } else {
                    res.status(201).send(req.body);
                    console.log(
                        `Successfully wrote file data and edit category with old id = ${req.params.id}`
                    );
                }
            });
        }
    });
});

app.delete("/categories/:id", (req, res) => {
    fs.readFile(file_path, "utf8", (err, dataJson) => {
        if (err) {
            console.log(`File read failed in DELETE /categories: ${err}`);
            res.status(500).send(`File read failed`);
            return;
        }
        var data = JSON.parse(dataJson);
        var idx = data.Categories.findIndex(
            (c) => c.id == req.params.id
        );

        if (idx != -1) {
            data.Categories.splice(idx, 1);
            var newList = JSON.stringify(data);
            fs.writeFile(file_path, newList, (err) => {
                if (err) {
                    console.log(
                        `Error writing file in DELETE /categories/${req.params.id}: ${err}`);
                    res.status(500).send(`Error writing file data.json`);
                } else {
                    res.status(204).send();
                    console.log(`Successfully deleted category with id = ${req.params.id}`);
                }
            });
        } else {
            console.log(`Category with id = ${req.params.id} does not exists`);
            res
                .status(500)
                .send(`Category with id = ${req.params.id} does not exists`);
            return;
        }
    });
});

// USER CRUD
//TODO: do not pass password on get
app.get("/users", (req, res) => {
    fs.readFile(file_path, "utf8", (err, dataJson) => {
        if (err) {
            console.log(`File read failed in GET /users: ${err}`);
            res.status(500).send("File read failed");
            return;
        }
        var data = JSON.parse(dataJson);
        var users = data.Users;
        console.log(`GET: /users`);
        res.send(users);
    });
});

app.get("/users/:id", (req, res) => {
    fs.readFile(file_path, "utf8", (err, dataJson) => {
        if (err) {
            console.log(`File read failed in GET /users/${req.params.id}: ${err}`);
            res.status(500).send(`File read failed`);
            return;
        }
        var data = JSON.parse(dataJson);
        var userBody = data.Users.find((u) => u.id == req.params.id);
        if (!userBody) {
            console.log(`GET: /users/${req.params.id} not exists`);
            res.status(500).send(`User with id = ${req.params.id} not found`);
        }
        console.log(`GET: /users/${userBody.id}`);
        res.send(userBody);
    });
});


app.post("/users", (req, res) => {
    fs.readFile(file_path, "utf8", (err, dataJson) => {
        if (err) {
            console.log(`File read failed in POST /users: ${err}`);
            res.status(500).send(`File read failed`);
            return;
        }
        var data = JSON.parse(dataJson);
        var category = data.Users.find((u) => u.id == req.body.id);
        if (category) {
            console.log(`User with id = ${req.body.id} already exists`);
            res
                .status(500)
                .send(`User with id = ${req.body.id} already exists`);
            return;
        }
        data.Users.push(req.body);
        var newList = JSON.stringify(data);
        fs.writeFile(file_path, newList, (err) => {
            if (err) {
                console.log(`Error writing file in POST /users: ${err}`);
                res.status(500).send(`Error writing file data.json`);
            } else {
                res.status(201).send(req.body);
                console.log(`Successfully wrote file with data and added new user with id = ${req.body.id}`);
            }
        });
    });
});

app.put("/users/:id", (req, res) => {
    fs.readFile(file_path, "utf8", (err, dataJson) => {
        if (err) {
            console.log(
                `File read failed in PUT /users/${req.params.id}: ${err}`);
            res.status(500).send(`File read failed`);
            return;
        }
        var data = JSON.parse(dataJson);
        var userBody = data.Users.find((u) => u.id == req.body.id);

        if (userBody && userBody.id != req.params.id) {
            console.log(`User with id = ${userBody.id} already exists`);
            res
                .status(500)
                .send(`User with id = ${userBody.id} already exists`);
            return;
        }
        var user = data.Users.find((u) => u.id == req.params.id);
        if (!user) {
            data.Users.push(req.body);
            var newList = JSON.stringify(data);
            fs.writeFile(file_path, newList, (err) => {
                if (err) {
                    console.log(
                        `Error writing file in PUT /users/${req.params.id}: ${err}`
                    );
                    res.status(500).send(`Error writing file data.json`);
                } else {
                    res.status(201).send(req.body);
                    console.log(
                        `Successfully wrote file data.json and added new user with id = ${req.body.id}`
                    );
                }
            });
        } else {
            var idx = data.Users.findIndex((n) => n.id == req.params.id);
            data.Users[idx] = req.body;
            var newList = JSON.stringify(data);
            fs.writeFile(file_path, newList, (err) => {
                if (err) {
                    console.log(
                        `Error writing file in PUT /users/${req.params.id}: ${err}`
                    );
                    res.status(500).send(`Error writing file data`);
                } else {
                    res.status(201).send(req.body);
                    console.log(
                        `Successfully wrote file data and edit user with old id = ${req.params.id}`
                    );
                }
            });
        }
    });
});

app.delete("/users/:id", (req, res) => {
    fs.readFile(file_path, "utf8", (err, dataJson) => {
        if (err) {
            console.log(`File read failed in DELETE /users: ${err}`);
            res.status(500).send(`File read failed`);
            return;
        }
        var data = JSON.parse(dataJson);
        var idx = data.Users.findIndex(
            (u) => u.id == req.params.id
        );

        if (idx != -1) {
            data.Users.splice(idx, 1);
            var newList = JSON.stringify(data);
            fs.writeFile(file_path, newList, (err) => {
                if (err) {
                    console.log(
                        `Error writing file in DELETE /users/${req.params.id}: ${err}`);
                    res.status(500).send(`Error writing file data.json`);
                } else {
                    res.status(204).send();
                    console.log(`Successfully deleted user with id = ${req.params.id}`);
                }
            });
        } else {
            console.log(`User with id = ${req.params.id} does not exists`);
            res
                .status(500)
                .send(`User with id = ${req.params.id} does not exists`);
            return;
        }
    });
});

// USER LOGIN
// validate the user credentials
app.post('/users/signin', function (req, res) {
    const user = req.body.username;
    const pwd = req.body.password;

    // return 400 status if username/password is not exist
    if (!user || !pwd) {
        return res.status(400).json({
            error: true,
            message: "Username or Password is required."
        });
    }

    var userData = storage.findUserByUsername(user);

    // return 401 status if the credential is not match.
    if (user !== userData.username || pwd !== userData.password) {
        return res.status(401).json({
            error: true,
            message: "Username or Password is wrong."
        });
    }

    // generate token
    const token = utils.generateToken(userData);
    // get basic user details
    const userObj = utils.getCleanUser(userData);
    // return the token along with user details
    return res.json({ user: userObj, token });
});

// verify the token and return it if it's valid
app.get('/verifyToken', function (req, res) {
    // check header or url parameters or post parameters for token
    var token = req.query.token;
    if (!token) {
        return res.status(400).json({
            error: true,
            message: "Token is required."
        });
    }


    // check token that was passed by decoding token using secret
    jwt.verify(token, process.env.JWT_SECRET, function (err, user) {
        if (err) return res.status(401).json({
            error: true,
            message: "Invalid token."
        });

        var userData = storage.findUserById(user.userId);

        // return 401 status if the userId does not match.
        if (user.userId !== userData.id) {
            return res.status(401).json({
                error: true,
                message: "Invalid user."
            });
        }
        // get basic user details
        var userObj = utils.getCleanUser(userData);
        return res.json({ user: userObj, token });
    });
});

// PREPARE SERVER AND DATA
app.listen(8002, () => {
    if (!fs.existsSync(file_path)) {
        console.log(`Data file not exists`);
        let data = {
            Users: [],
            Categories: [],
            Notes: []
        };
        storage.save(data);
    }
    fs.readFile(file_path, "utf8", (err, dataJson) => {
        if (err) {
            console.log(`Error reading file: ${err}`);
            return;
        }
        var data = JSON.parse(dataJson);
        var notes = data.Notes;
        var users = data.Users;
        var categories = data.Categories;
        if (notes == undefined)
            data.Notes = [];
        if (users == undefined)
            data.Users = [];
        if (categories == undefined)
            data.Categories = [];
        storage.save(data);
    });

    console.log("Server address http://localhost:8002");
});

