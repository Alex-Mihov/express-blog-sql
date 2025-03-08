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

// funzione show
function show(req, res) {
    // salviamo l'id
    const id = req.params.id

    // salviamo la query
    // const postSql = `
    //    SELECT * 
    //    FROM posts
    //    WHERE id = ?
    // `


    // salviamo la query di tags
    const tagSql = `
    SELECT *
    FROM posts 
    JOIN post_tag ON post_tag.post_id = posts.id
    JOIN tags ON tags.id = post_tag.tag_id
    WHERE posts.id = ?
    `


    // tramite query ci troviamo il singolo post
    // connection.query(postSql, [id], (err, postResults) => {
    //     if (err) return res.status(500).json({ error: "'Database query failed" });
    //     if (postResults.length === 0) return res.status(404).json({ error: "post non trovato" });
    //     res.json(postResults[0]);
    //     console.log(postResults);

    // })

    // tramite query ci troviamo il singolo post con i tags
    connection.query(tagSql, [id], (err, postResults) => {
        if (err) return res.status(500).json({ error: "'Database query failed" });
        if (postResults.length === 0) return res.status(404).json({ error: "post non trovato" });
        res.json(postResults[0]);
        console.log(postResults);

    })
}

// funzione create 
function store(req, res) {

    // 
    const { title, content, image } = req.body;

    // salviamo la query
    const addPostSql = `
    INSERT INTO posts(title, content, image)
    VALUES (?, ?, ?)
    `

    connection.query(addPostSql, [title, content, image], (err, postResults) => {
        if (err) return res.status(500).json({ error: "'Database query failed" });
        if (postResults.length === 0) return res.status(404).json({ error: "post non trovato" });
        res.json(postResults[0]);
    })

}

// funzio

// funzione delete
function destroy(req, res) {

    // prepariamo l'id
    const id = req.params.id

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

module.exports = { index, destroy, show, store }