const { connect, connection } = require('mongoose');

// CREATE CONNECTION POINT HERE
connect('mongodb://127.0.0.1:27017/social_thoughts_api');

module.exports = connection;
