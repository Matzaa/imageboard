const express = require("express");
const app = express();
const db = require("./sql/db");
const s3 = require("./s3");
const config = require("./config.json");

app.use(express.static("public"));

//------------- image upload boilerplate -------------------
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});
//----------------------------------------------------------

app.get("/cards", (req, res) => {
    console.log("/cards route has been hit");
    db.getData()
        .then((results) => {
            console.log("results.rows", results.rows);
            let resultsOrdered = results.rows;
            let cards = resultsOrdered.reverse();
            res.json(cards);
        })
        .catch((err) => {
            console.log("err in GET", err);
        });
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    console.log("req.file", req.file); //file we just uploaded
    console.log("input", req.body); //input fields from the client
    if (req.file) {
        let url = config.s3Url + req.file.filename;
        db.addData(
            url,
            req.body.username,
            req.body.title,
            req.body.description
        ).then((results) => {
            console.log("POST results", results);
            res.json({ results });
        });
    } else {
        res.json({ success: false });
    }
});

app.listen(8080, () => console.log("IB server is listening"));
