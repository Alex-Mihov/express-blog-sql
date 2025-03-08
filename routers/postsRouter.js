// importiamo express
const express = require("express");

// importiamo router
const router = express.Router();

// importiamo i controller
const controllers = require("../controllers/postsControllers")

// rotte CRUD
router.get("/", controllers.index)
router.get("/:id", (req, res) => { res.json("rotta show") })
router.post("/", (req, res) => { res.json("rotta store") })
router.put("/:id", (req, res) => { res.json("rotta update") })
router.patch("/:id", (req, res) => { res.json("rotta modify") })
router.delete("/:id", (req, res) => { res.json("rotta destroy") })

module.exports = router;