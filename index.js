const express = require('express');
const path = require("path");
const axios = require('axios');


const app = express();
const port = process.env.PORT || 3001;
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.get('/?', async (req, res) => {
    let data = [];
    let addresses = typeof req.query.address === 'string' ? [req.query.address] : req.query.address;
    for (address of addresses) {
        await urlCheck(!address.includes('http') ? "http://" + address : address) ? data.push(address) : data.push(`${address} - NO RESPONSE`);
    }
    res.status(200).render("index", { websites: data })
});

app.get('*', (req, res) => res.status(404).render("error"));


app.listen(port, () => console.log(`Server listening on PORT ${port}`));


const urlCheck = async (url) => {
    try {
        await axios.head(url);
        return true;
    } catch (error) {
        return false;
    }
}