const express = require('express');
const path = require("path");
const axios = require('axios');
const RSVP = require('rsvp');


const app = express();
const port = process.env.PORT || 3000;
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

const checkUrl = (url) => {
    return url.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g) !== null
}


// USING CALLBACKS
app.get('/I/want/title/?', (req, res) => {
    let addresses = typeof req.query.address === 'string' ? [req.query.address] : req.query.address;
    fetchTitles(addresses, data => res.status(200).render("index", { websites: data }));
});
const fetchTitles = async (addresses, callback) => {
    let titles = [];
    if(addresses){
        for (let address of addresses) {
            try {
                let url = !address.includes('http') ? "http://" + address : address
                let data = checkUrl(url) ? await axios.get(url) : null;
                let title = data.data.match(/<title[^>]*>([^<]+)<\/title>/)[1];
                titles.push(title ? `${address} - "${title}"` : `${address} - NO RESPONSE`);
            } catch (error) {
                titles.push(`${address} - NO RESPONSE`);
            }
        }
    }
    callback(titles);
}


//USING ASYNC AWAIT
// app.get('/I/want/title/?', async (req, res) => {
//     let addresses = typeof req.query.address === 'string' ? [req.query.address] : req.query.address;
//     let data = await fetchTitles(addresses);
//     res.status(200).render("index", { websites: data });
// });
// const fetchTitles = async (addresses) => {
//     let titles = [];
//     if(addresses){
//         for (let address of addresses) {
//             try {
//                 let url = !address.includes('http') ? "http://" + address : address
//                 let data = checkUrl(url) ? await axios.get(url) : null;
//                 let title = data.data.match(/<title[^>]*>([^<]+)<\/title>/)[1];
//                 titles.push(title ? `${address} - "${title}"` : `${address} - NO RESPONSE`);
//             } catch (error) {
//                 titles.push(`${address} - NO RESPONSE`);
//             }
//         }
//     }
//     return titles;
// }

//USING PROMISES (RSVP PACKAGE)
// app.get('/I/want/title/?', async (req, res) => {
//     let addresses = typeof req.query.address === 'string' ? [req.query.address] : req.query.address;
//     let promises = addresses.map(async address => {
//         let url = !address.includes('http') ? "http://" + address : address;
//         return checkUrl(url) ? axios.get(url) : null;
//     });
//     let titles = []
//     RSVP.all(promises)
//     .then(data => {
//         data.forEach((site, index) => {
//             if(site){
//                 let title = site.data.match(/<title[^>]*>([^<]+)<\/title>/)[1];
//                 titles.push(title ? `${addresses[index]} - "${title}"` : `${addresses[index]} - NO RESPONSE`);
//             }else{
//                 titles.push(`${addresses[index]} - NO RESPONSE`);
//             }
//         })
//         res.status(200).render("index", { websites: titles });
//     });
// });

app.get('*', (req, res) => res.status(404).render("error"));

app.listen(port, () => console.log(`Server listening on PORT ${port}`));