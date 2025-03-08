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

// funzione delete
function destroy(req, res) {

    // prepariamo l'id
    const { id } = req.params;

    // prepariamo la qurey
    const postSql = `
       DELETE 
       FROM posts
       WHERE id = ?
    `

    // eliminiamo il post 
    connection.query(postSql, [id], (err) => {
        if (err) return res.status(500).json({ error: "failed to delete" });
        if (err) return res.status(404).json({ error: "post non trovato" });

        res.sendStatus(204);
    })
}

module.exports = { index, destroy }