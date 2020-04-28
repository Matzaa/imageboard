const express = require("express");
const app = express();
const db = require("./sql/db");
const s3 = require("./s3");
const config = require("./config.json");

app.use(express.json());
app.use(express.static("public"));

//------------------------------------------------------------------
//--------------------- image upload boilerplate -------------------
//------------------------------------------------------------------
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

//-------------------- loading all --------------------------------
app.get("/cards", (req, res) => {
    console.log("/cards route has been hit");
    db.getAllData()
        .then((results) => {
            res.json(results.rows);
        })
        .catch((err) => {
            console.log("err in GET", err);
        });
});

app.post("/more/:lastId", (req, res) => {
    console.log("req", req.params);
    var startId = req.params.lastId;
    db.getMoreImages(startId)
        .then((results) => {
            console.log("results in get more pix", results);
            res.json(results);
        })
        .catch((err) => {
            console.log("err in getMoreImages", err);
        });
});

//---------------- upload new pic on submit button ---------------
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
            res.json(results);
        });
    } else {
        res.json({ success: false });
    }
});

//----------------- modal -------------------------------------------
app.post("/getImage/:id", (req, res) => {
    console.log("req.params", req.params);
    db.getImage(req.params.id)
        .then((results) => {
            console.log(
                "res.rows[0] from db query in modal post",
                results.rows[0]
            );
            res.json(results.rows[0]);
        })
        .catch((err) => {
            console.log("err in POST getImage", err);
        });
});

app.post("/getComments/:id", (req, res) => {
    db.getComments(req.params.id)
        .then((results) => {
            console.log("results.rows in getcomments", results.rows);
            res.json(results.rows);
        })
        .catch((err) => {
            console.log("err in getComments POST", err);
        });
});

//-------------------- adding comments -----------------------------
app.post("/postComment/:id", (req, res) => {
    console.log("req.body", req.body);
    console.log("req.params on Pcomment", req.params);
    db.addComment(req.body.comment, req.body.commenter, req.params.id)
        .then((results) => {
            res.json(results);
        })
        .catch((err) => {
            console.log("err in postComment", err);
        });
});

app.listen(8080, () => console.log("IB server is listening"));
