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
    const postSql = `
    SELECT * 
    FROM posts 
    WHERE id = ?
    `;

    // Query per ottenere i tag associati al post
    const tagSql = `
        SELECT tags.label
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
    const addPostSql = `
    INSERT INTO posts(title, content, image) 
    VALUES (?, ?, ?)
    `;

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

function update(req, res) {
    const id = parseInt(req.params.id);
    const { title, content, image, tags } = req.body; // tags può contenere sia ID numerici che stringhe

    // Query per aggiornare il post
    const sqlUpdatePost = `
        UPDATE posts 
        SET title = ?, content = ?, image = ?
        WHERE id = ?;
    `


    connection.query(sqlUpdatePost, [title, content, image, id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Database query failed' });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Post non trovato' });

        if (!tags || tags.length === 0) {
            return res.json({ message: 'Post aggiornato con successo', id });
        }
        // Eliminare i vecchi tag associati al post
        const sqlDeleteTags = 'DELETE FROM post_tag WHERE postid = ?';
        connection.query(sqlDeleteTags, [id], (err) => {
            if (err) return res.status(500).json({ error: 'Failed to update tags' });

            // Separiamo i tag in ID esistenti e nuovi tag da creare
            const existingTagIds = [];
            const newTags = [];

            tags.forEach(tag => {
                if (typeof tag === 'number') {
                    existingTagIds.push(tag); // È un ID, lo usiamo direttamente
                } else if (typeof tag === 'string') {
                    newTags.push(tag); // È un nuovo nome di tag, dobbiamo crearlo
                }
            });

            // Se ci sono nuovi tag, li inseriamo
            if (newTags.length > 0) {
                const sqlInsertNewTags = 'INSERT INTO tags (label) VALUES ?';
                const tagValues = newTags.map(tag => [tag]);

                connection.query(sqlInsertNewTags, [tagValues], (err, result) => {
                    if (err) return res.status(500).json({ error: 'Failed to insert new tags' });

                    // Recuperiamo i nuovi ID generati
                    const newTagIds = Array.from({ length: result.affectedRows }, (_, i) => result.insertId + i);

                    // Combiniamo i nuovi tag con quelli già esistenti
                    const allTagIds = [...existingTagIds, ...newTagIds];

                    insertTagsIntoPost(id, allTagIds, res);
                });
            } else {
                // Se non ci sono nuovi tag, usiamo solo quelli esistenti
                insertTagsIntoPost(id, existingTagIds, res);
            }
        });
    });
}

// Funzione per modificare un post senza gestire i tag
function modify(req, res) {
    // Recuperiamo l'ID del post dalla URL (parametri della richiesta)
    const id = parseInt(req.params.id); // Convertiamo l'ID del post in un numero intero

    // Estraiamo il titolo, il contenuto e l'immagine dalla richiesta (body)
    const { title, content, image } = req.body;

    // Creiamo due array vuoti per raccogliere i campi da aggiornare e i relativi valori
    const updateFields = [];
    const updateValues = [];

    // Verifichiamo se ciascun campo è definito nella richiesta e, in caso positivo, lo aggiungiamo
    // alla lista dei campi da aggiornare con il rispettivo valore
    if (title !== undefined) {
        updateFields.push("title = ?"); // Aggiungiamo la colonna title nella query
        updateValues.push(title); // Aggiungiamo il valore del title
    }
    if (content !== undefined) {
        updateFields.push("content = ?"); // Aggiungiamo la colonna content nella query
        updateValues.push(content); // Aggiungiamo il valore del content
    }
    if (image !== undefined) {
        updateFields.push("image = ?"); // Aggiungiamo la colonna image nella query
        updateValues.push(image); // Aggiungiamo il valore dell'image
    }

    // Se nessun campo è stato fornito da aggiornare, restituiamo un errore
    if (updateFields.length === 0) {
        return res.status(400).json({ error: "Nessun campo da aggiornare" }); // Rispondiamo con errore 400
    }

    // Creiamo la query SQL per aggiornare il post
    const sqlUpdatePost = `UPDATE posts SET ${updateFields.join(", ")} WHERE id = ?`;
    updateValues.push(id); // Aggiungiamo l'ID del post al valore finale da passare alla query

    // Eseguiamo la query di aggiornamento sul database
    connection.query(sqlUpdatePost, updateValues, (err, result) => {
        // Se si verifica un errore durante la query, rispondiamo con errore 500
        if (err) return res.status(500).json({ error: "Errore nella query al database" });
        // Se il post con l'ID specificato non esiste (nessuna riga aggiornata), rispondiamo con errore 404
        if (result.affectedRows === 0) return res.status(404).json({ error: "Post non trovato" });
        // Se l'aggiornamento va a buon fine, restituiamo un messaggio di successo
        res.json({ message: "Post aggiornato con successo", id });
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
module.exports = { index, destroy, show, store, update, modify };