const express = require('express');
const path = require("path");
const axios = require('axios');


const app = express();
const port = process.env.PORT || 3001;
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.get('/?', async (req, res) => {
    let addresses = typeof req.query.address === 'string' ? [req.query.address] : req.query.address;
    fetchTitles(addresses, data => res.status(200).render("index", { websites: data }));
});

app.get('*', (req, res) => res.status(404).render("error"));


app.listen(port, () => console.log(`Server listening on PORT ${port}`));


const fetchTitles = async (addresses, callback) => {
    let titles = [];
    for (let address of addresses) {
        try {
            let data = await axios.get(!address.includes('http') ? "http://" + address : address)
            let title = data.data.match(/<title[^>]*>([^<]+)<\/title>/)[1];
            titles.push(title ? `${address} - "${title}"` : `${address} - NO RESPONSE`);
        } catch (error) {
            titles.push(`${address} - NO RESPONSE`);
        }
    }
    callback(titles);
}

//https://stackoverflow.com/questions/45620694/how-to-return-response-of-axios-in-return

//https://www.codementor.io/@adititipnis/javascript-how-to-make-api-calls-for-each-value-in-an-array-and-get-an-array-of-results-v1sfcj11o