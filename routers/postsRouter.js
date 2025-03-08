// Importiamo Express
const express = require("express");

// Creiamo un'istanza di Router per definire le rotte
const router = express.Router();

// Importiamo i controller che gestiranno le richieste
const controllers = require("../controllers/postsControllers")

// Rotte per le operazioni CRUD

// Ottieni tutti i post (index)
router.get("/", controllers.index)

// Ottieni un singolo post in base all'ID (show)
router.get("/:id", controllers.show)

// Crea un nuovo post (store)
router.post("/", controllers.store)

// Modifica un post esistente (update) utilizzando l'ID
router.put("/:id", controllers.update)

// Modifica parziale un post (patch) - rotta di esempio
router.patch("/:id", (req, res) => {
    res.json("rotta modify")
})

// Elimina un post in base all'ID (delete)
router.delete("/:id", controllers.destroy)

module.exports = router;
