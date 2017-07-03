/**
 * Created by SOFTMAN on 01-07-2017.
 */

var express = require("express"),
    app = express(),
    fs = require("fs"),
    bodyParser = require("body-parser"),
    path = require('path'),
    logger = require("morgan");

app.set('views', path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

require("./routes/routes.js")(express, app);

var port = process.env.PORT || 3000 ;

app.listen(port, function () {
    console.log("App running at:"+port)
});