const express = require("express");
const app = express();
const db = require("./sql/db");

app.use(express.static("public"));

let cities = [
    {
        name: "Berlin",
        country: "DE",
    },
    {
        name: "Guayaquil",
        country: "Ecuador",
    },
    {
        name: "Sheffield",
        country: "UK",
    },
];

app.get("/cards", (req, res) => {
    console.log("/cards route has been hit");
    db.getData()
        .then((results) => {
            console.log("results.rows", results.rows);
            let cards = results.rows;
            res.json(cards);
        })
        .catch((err) => {
            console.log("err in GET", err);
        });
});

app.listen(8080, () => console.log("IB server is listening"));
