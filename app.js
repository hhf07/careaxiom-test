const express = require('express');
const path = require("path");
const axios = require('axios');


const app = express();
const port = process.env.PORT || 3002;
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.get('/?', async (req, res) => {
    let addresses = typeof req.query.address === 'string' ? [req.query.address] : req.query.address;
    // for (address of addresses) {
    //     let title = await urlCheck(!address.includes('http') ? "http://" + address : address);
    //     data.push( title ? `${address} - "${title}"` : `${address} - NO RESPONSE`);
    // }
    // urlCheck(addresses).then(data => res.status(200).render("index", { websites: data }))
    const data = await urlCheck(addresses);
        res.status(200).render("index", { websites: data })
});

app.get('*', (req, res) => res.status(404).render("error"));


app.listen(port, () => console.log(`Server listening on PORT ${port}`));


const urlCheck = (addresses) => {
    try {
        return addresses.map(async address => {
            let data = await axios.get(!address.includes('http') ? "http://" + address : address)
            let title = data.data.match(/<title[^>]*>([^<]+)<\/title>/)[1];
            return title ? `${address} - "${title}"` : `${address} - NO RESPONSE`;
            // })
        })
        // return titles;
    } catch (error) {
        return false;
    }
}

//https://stackoverflow.com/questions/45620694/how-to-return-response-of-axios-in-return

//https://www.codementor.io/@adititipnis/javascript-how-to-make-api-calls-for-each-value-in-an-array-and-get-an-array-of-results-v1sfcj11o