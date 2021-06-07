// generate token using secret from process.env.JWT_SECRET
var jwt = require('jsonwebtoken');
var crypto = require('crypto');
const saltRounds = 10;
// generate token and return it
generateToken = (user) => {
  //1. Don't use password and other sensitive fields
  //2. Use the information that are useful in other parts
  if (!user) return null;

  var u = {
    userId: user.id,
    name: user.firstname,
    username: user.username,
    lastname: user.lastname,
    isAdmin: user.isAdmin
  };

  return jwt.sign(u, process.env.JWT_SECRET, {
    expiresIn: 60 * 60 * 24 // expires in 24 hours
  });
}

// return basic user details
getCleanUser = (user) => {
  if (!user) return null;

  return {
    userId: user.id,
    name: user.firstname,
    lastname: user.lastname,
    username: user.username,
    isAdmin: user.isAdmin
  };
}

generateSalt = () => {
  return crypto.randomBytes(Math.ceil(saltRounds / 2)).toString('hex').slice(0, saltRounds);
}

hashPassword = (password, salt) => {
  let hash = crypto.createHmac('sha512', salt);
  hash.update(password);
  let value = hash.digest('hex');
  return {
    salt: salt,
    hashedpassword: value
  };
}

matchHash = (password, hash) => {
  let passwordData = hashPassword(password, hash.salt);
  if (passwordData.hashedpassword === hash.hashedpassword) {
    return true;
  }
  return false
}

module.exports = {
  generateToken,
  getCleanUser,
  generateSalt,
  hashPassword,
  matchHash
}