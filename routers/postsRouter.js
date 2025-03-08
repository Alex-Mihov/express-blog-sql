// Importiamo Express
const express = require("express");

// Creiamo un'istanza di Router per definire le rotte relative ai post
const router = express.Router();

// Importiamo i controller che gestiranno le richieste per le operazioni sui post
const controllers = require("../controllers/postsControllers");

// Definizione delle rotte per le operazioni CRUD sui post

// Recupera tutti i post (GET /api/posts)
router.get("/", controllers.index);

// Recupera un singolo post in base all'ID (GET /api/posts/:id)
router.get("/:id", controllers.show);

// Crea un nuovo post (POST /api/posts)
router.post("/", controllers.store);

// Aggiorna completamente un post esistente in base all'ID (PUT /api/posts/:id)
// router.put("/:id", controllers.update);

// Aggiorna parzialmente un post esistente (PATCH /api/posts/:id) - Esempio di rotta
router.patch("/:id", (req, res) => {
    res.json("Rotta per modifica parziale di un post");
});

// Elimina un post in base all'ID (DELETE /api/posts/:id)
router.delete("/:id", controllers.destroy);

// Esportiamo il router per poterlo utilizzare in altre parti dell'app
module.exports = router;
