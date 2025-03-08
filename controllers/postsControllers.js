// importiamo il database
const connection = require("../data/db")

// funzione per operazioni crud

// funzione index
function index(req, res) {
    // prepariamo la query 
    const postSql = `
        SELECT *
        FROM posts
    `

    // eseguiamo la query 
    connection.query(postSql, (err, postResults) => {
        if (err) return res.status(500).json({ error: "dababase query failed" })
        res.json(postResults)
    })
}

module.exports = { index }