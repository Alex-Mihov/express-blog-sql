const express = require('express')
const app = express()
const port = 3000

// importiamo router
const postsRouter = require("./routers/postsRouter");

// registro il body-parser per json
app.use(express.json());

// definiamo l'uso di una cartella per i file statici
app.use(express.static('public'));

// impostiamo la rotta principale 
app.get("/", (req, res) => { res.json("rotta principaleeee") })

// impostiamo le rotte per le operazioni crud
app.use("/posts", postsRouter)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})