// Importiamo express per creare l'app
const express = require('express')
// Creiamo l'app Express
const app = express()
// Definiamo la porta su cui l'app ascolta (3000)
const port = 3000

// Importiamo il router per gestire le rotte dei post
const postsRouter = require("./routers/postsRouter");

// Configuriamo express per leggere i dati in formato JSON nelle richieste
app.use(express.json());

// Configuriamo express per usare la cartella 'public' per i file statici (es. immagini, CSS, etc.)
app.use(express.static('public'));

// Creiamo la rotta principale "/" che risponde con un messaggio
app.get("/", (req, res) => {
    res.json("rotta principaleeee")
})

// Usiamo il router per le rotte che iniziano con "/posts"
app.use("/posts", postsRouter)

// Avviamo il server sulla porta 3000
app.listen(port, () => {
    console.log(`App in ascolto sulla porta ${port}`)
})
