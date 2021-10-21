const express = require('express');
const path = require("path");


const app = express();
const port = process.env.PORT || 3001;
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.get('/?', async (req, res) => {
    res.status(200).render("index", { websites: typeof req.query.address === 'string' ? [req.query.address] : req.query.address })
});

app.get('*', (req, res) => res.status(404).render("error"));


app.listen(port, () => console.log(`Server listening on PORT ${port}`));