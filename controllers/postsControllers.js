// Importiamo la connessione al database
const connection = require("../data/db")

// Funzione per ottenere tutti i post
function index(req, res) {
    // Prepariamo la query per ottenere tutti i post con i rispettivi tag
    const postSql = `
        SELECT *
        FROM posts
        JOIN post_tag ON post_tag.post_id = posts.id
        JOIN tags ON tags.id = post_tag.tag_id
    `

    // Eseguiamo la query
    connection.query(postSql, (err, postResults) => {
        if (err) return res.status(500).json({ error: "Database query failed" })
        res.json(postResults)  // Restituiamo i risultati dei post
    })
}

// Funzione per ottenere un singolo post
function show(req, res) {
    // Otteniamo l'ID del post dalla richiesta
    const id = parseInt(req.params.id)

    // Query per ottenere il singolo post
    const postSql = `
       SELECT * 
       FROM posts
       WHERE id = ?
    `

    // Query per ottenere i tag associati al singolo post
    const tagSql = `
    SELECT posts.*, tags.label
    FROM posts 
    JOIN post_tag ON post_tag.post_id = posts.id
    JOIN tags ON tags.id = post_tag.tag_id
    HAVING posts.id = ?
    `

    // Eseguiamo la query per ottenere il post
    connection.query(postSql, [id], (err, postResults) => {
        if (err) return res.status(500).json({ error: "Database query failed" });
        if (postResults.length === 0) return res.status(404).json({ error: "Post non trovato" });
        res.json(postResults[0]);  // Restituiamo il post trovato
    })

    // Eseguiamo la query per ottenere i tag del post
    connection.query(tagSql, [id], (err, tagResults) => {
        if (err) return res.status(500).json({ error: "Database query failed" });
        if (tagResults.length === 0) return res.status(404).json({ error: "Tags non trovati" });
        res.json(tagResults);  // Restituiamo i tag associati al post
    })
}

// Funzione per creare un nuovo post
function store(req, res) {
    // Estraiamo i dati del post dalla richiesta
    const { title, content, image } = req.body;

    // Query per inserire il nuovo post
    const addPostSql = `
    INSERT INTO posts(title, content, image)
    VALUES (?, ?, ?)
    `

    // Eseguiamo la query per inserire il post
    connection.query(addPostSql, [title, content, image], (err, postResults) => {
        if (err) return res.status(500).json({ error: "Database query failed" });
        res.json(postResults);  // Restituiamo il risultato dell'inserimento
    })
}

// Funzione per aggiornare un post esistente
function update(req, res) {
    // Otteniamo l'ID del post dalla richiesta
    const id = parseInt(req.params.id)

    // Estraiamo i dati da aggiornare
    const { title, content, image, label } = req.body;

    // Query per aggiornare il post e il tag associato
    const updatePostSql = `
    UPDATE posts
    JOIN post_tag ON post_tag.post_id = posts.id
    JOIN tags ON tags.id = post_tag.tag_id
    SET 
    posts.title = ?,
    posts.content = ?,
    posts.image = ?,
    tags.label = ?
    WHERE posts.id = ? AND tags.label = ?
    `

    // Eseguiamo la query per aggiornare il post
    connection.query(updatePostSql, [title, content, image, label, id], (err, postResults) => {
        if (err) return res.status(500).json({ error: "Database query failed" });
        if (postResults.length === 0) return res.status(404).json({ error: "Post non trovato" });
        res.json(postResults[0]);  // Restituiamo il post aggiornato
    })
}

// Funzione per eliminare un post
function destroy(req, res) {
    // Otteniamo l'ID del post dalla richiesta
    const id = parseInt(req.params.id)

    // Query per eliminare il post
    const deletePostSql = `
       DELETE 
       FROM posts
       WHERE id = ?
    `

    // Eseguiamo la query per eliminare il post
    connection.query(deletePostSql, [id], (err) => {
        if (err) return res.status(500).json({ error: "Failed to delete post" });
        res.sendStatus(204);  // Indichiamo che l'operazione è riuscita senza contenuto da restituire
    })
}

// Esportiamo tutte le funzioni per usarle in altri file
module.exports = { index, destroy, show, store, update }
