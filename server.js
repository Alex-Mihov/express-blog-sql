// Importiamo il modulo Express per creare e gestire il server
const express = require('express');

// Creiamo un'istanza dell'applicazione Express
const app = express();

// Definiamo la porta su cui il server sarà in ascolto
const port = 3000;

// Importiamo il router per gestire le rotte relative ai post
const postsRouter = require("./routers/postsRouter");

// Configuriamo Express per analizzare le richieste con corpo in formato JSON
app.use(express.json());

// Configuriamo Express per servire file statici dalla cartella "public" (es. immagini, CSS, JavaScript)
app.use(express.static('public'));

// Definiamo la rotta principale "/" che risponde con un messaggio JSON
app.get("/", (req, res) => {
    res.json("Benvenuto nella rotta principale!");
});

// Usiamo il router per tutte le richieste che iniziano con "/posts"
app.use("/posts", postsRouter);

// Avviamo il server e lo mettiamo in ascolto sulla porta specificata
app.listen(port, () => {
    console.log(`Server avviato e in ascolto sulla porta ${port}`);
});

