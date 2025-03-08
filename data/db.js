const mysql = require("mysql2")
const { connect } = require("../routers/postsRouter")
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "0175",
    database: "db_blog"
})

connection.connect((err) => {
    if (err) throw err;
    console.log("connection to my sql");
})

module.exports = connection;