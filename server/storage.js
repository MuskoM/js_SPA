const fs = require("fs");
const file_path = "./data.json";

save = (data) => {
    fs.writeFile(file_path, JSON.stringify(data), (err) => {
        if (err) console.log(`Error creating data file`);
    });
}

findUserByUsername = (username) => {
    var file = fs.readFileSync(file_path, "utf8");
    var data = JSON.parse(file);
    return data.Users.find((u) => u.username == username);
}

findUserById = (id) => {
    var file = fs.readFileSync(file_path, "utf8");
    var data = JSON.parse(file);
    var user = data.Users.find((u) => u.id == id);
    return user;
}

module.exports = {
    save,
    findUserByUsername,
    findUserById
}