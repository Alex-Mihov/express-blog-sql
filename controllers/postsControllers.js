// Importiamo la connessione al database
const connection = require("../data/db");

// Funzione per ottenere tutti i post con i rispettivi tag
function index(req, res) {
    // Query per ottenere tutti i post e i loro tag
    const postSql = `
        SELECT *
        FROM posts
        JOIN post_tag ON post_tag.post_id = posts.id
        JOIN tags ON tags.id = post_tag.tag_id
    `;

    // Eseguiamo la query per recuperare tutti i post
    connection.query(postSql, (err, postResults) => {
        if (err) {
            // Se c'è un errore nella query, restituiamo un errore 500
            return res.status(500).json({ error: "Database query failed" });
        }
        // Restituiamo i risultati della query in formato JSON
        res.json(postResults);
    });
}

// Funzione per ottenere un singolo post con i suoi tag
function show(req, res) {
    const id = parseInt(req.params.id); // Otteniamo l'ID del post dalla richiesta

    // Query per ottenere il post specifico
    const postSql = `SELECT * FROM posts WHERE id = ?`;

    // Query per ottenere i tag associati al post
    const tagSql = `
        SELECT *
        FROM tags
        JOIN post_tag ON tags.id = post_tag.tag_id
        WHERE post_id = ?
    `;

    // Eseguiamo la query per ottenere il post
    connection.query(postSql, [id], (err, postResults) => {
        if (err) {
            // Se c'è un errore nella query, restituiamo un errore 500
            return res.status(500).json({ error: "Database query failed" });
        }
        if (postResults.length === 0) {
            // Se il post non esiste, restituiamo un errore 404
            return res.status(404).json({ error: "Post non trovato" });
        }

        const post = postResults[0]; // Salviamo il post trovato

        // Eseguiamo la query per ottenere i tag associati al post
        connection.query(tagSql, [id], (err, tagsResults) => {
            if (err) {
                // Se c'è un errore nella query, restituiamo un errore 500
                return res.status(500).json({ error: "Database query failed" });
            }
            // Assegniamo i tag al post
            post.tags = tagsResults;
            // Restituiamo il post con i suoi tag
            res.json(post);
        });
    });
}

// Funzione per creare un nuovo post
function store(req, res) {
    const { title, content, image } = req.body; // Estraiamo i dati dal body della richiesta

    // Query per inserire il nuovo post nel database
    const addPostSql = `INSERT INTO posts(title, content, image) VALUES (?, ?, ?)`;

    // Eseguiamo la query per inserire il post
    connection.query(addPostSql, [title, content, image], (err, postResults) => {
        if (err) {
            // Se c'è un errore nella query, restituiamo un errore 500
            return res.status(500).json({ error: "Database query failed" });
        }
        // Restituiamo i dati del nuovo post inserito
        res.json(postResults);
    });
}

// Funzione per aggiornare un post esistente
function update(req, res) {
    const id = parseInt(req.params.id); // Otteniamo l'ID del post dalla richiesta
    const { title, content, image, label } = req.body; // Estraiamo i dati dal body

    // Query per aggiornare il post e il tag associato
    const updatePostSql = `
        UPDATE posts
        JOIN post_tag ON post_tag.post_id = posts.id
        JOIN tags ON tags.id = post_tag.tag_id
        SET posts.title = ?, posts.content = ?, posts.image = ?, tags.label = ?
        WHERE posts.id = ? AND tags.label = ?
    `;

    // Eseguiamo la query per aggiornare il post
    connection.query(updatePostSql, [title, content, image, label, id], (err, postResults) => {
        if (err) {
            // Se c'è un errore nella query, restituiamo un errore 500
            return res.status(500).json({ error: "Database query failed" });
        }
        if (postResults.length === 0) {
            // Se il post non esiste, restituiamo un errore 404
            return res.status(404).json({ error: "Post non trovato" });
        }
        // Restituiamo il post aggiornato
        res.json(postResults[0]);
    });
}

// Funzione per eliminare un post
function destroy(req, res) {
    const id = parseInt(req.params.id); // Otteniamo l'ID del post dalla richiesta

    // Query per eliminare il post specifico
    const deletePostSql = `DELETE FROM posts WHERE id = ?`;

    // Eseguiamo la query per eliminare il post
    connection.query(deletePostSql, [id], (err) => {
        if (err) {
            // Se c'è un errore nella query, restituiamo un errore 500
            return res.status(500).json({ error: "Failed to delete post" });
        }
        // Restituiamo stato 204 (No Content) per indicare successo
        res.sendStatus(204);
    });
}

// Esportiamo le funzioni per l'uso in altri file
module.exports = { index, destroy, show, store, update };