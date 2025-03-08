// importiamo express
const express = require("express");

// importiamo router
const router = express.Router();

// importiamo i controller
const controllers = require("../controllers/postsControllers")

// rotte CRUD
// index
router.get("/", controllers.index)
// show
router.get("/:id", controllers.show)
router.post("/", (req, res) => { res.json("rotta store") })
router.put("/:id", (req, res) => { res.json("rotta update") })
router.patch("/:id", (req, res) => { res.json("rotta modify") })
// delete
router.delete("/:id", controllers.destroy)

module.exports = router;