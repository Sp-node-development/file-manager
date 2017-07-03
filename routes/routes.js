/**
 * Created by SOFTMAN on 01-07-2017.
 */
module.exports = function (express, app) {
    var path = require("path"),
        fs = require("fs"),
        // the default drive
        dir = process.env.dirpath || "./";
        router = express.Router(),
        archiver = require('archiver'),
        formidable = require('formidable'),
        // util = require('util'),
        dirpop = dir ;

    router.get('/', function (req, res, next) {
        res.sendFile('files.html', {root: path.join(__dirname, "..", "views")});
    });
    router.get("/files/*", function (req, res, next) {
        console.log("path : " + req.url);
        var decodedURI = decodeURI(req.url)
        var dirarr = decodedURI.split('/');
        var dirpath = path.join(dir, dirarr.slice(2).join("/"));
        var stat = fs.lstatSync(dirpath);
        var isDir = fs.lstatSync(dirpath).isDirectory();
        dirpop = dirpath;
        if (isDir) {
            //    Its a directory
            fs.readdir(dirpath, function (err, files) {
                var fileObj,
                    filesArr = [];
                files.forEach(function (file) {
                    fileObj = {
                        name: file,
                        path: decodedURI + "/" + file,
                        time: fs.lstatSync(path.join(dirpath, file)).mtime.toLocaleString(),
                        isDir: fs.lstatSync(path.join(dirpath, file)).isDirectory()
                    };
                    filesArr.push(fileObj)
                });

                if (err) throw err;
                var obj = {
                    files: filesArr,
                    isDir: isDir,
                    path: decodedURI,
                    time: stat.mtime.toLocaleString(),
                    type: "dir"
                }
                return res.json(obj)
            });
        } else {
            //Its a file
            var obj = {
                type: path.extname(dirpath),
                path: dirpath,
                time: stat.mtime.toLocaleString(),
                isDirectory: isDir
            }
            return res.json(obj)
        }

    });

    router.get("/files", function (req, res, next) {

        fs.readdir(dir, function (err, files) {
            var fileObj,
                filesArr = [];

            files.forEach(function (file) {
                fileObj = {
                    name: file,
                    path: "/files/" + file,
                    time: fs.lstatSync(path.join(dir, file)).mtime.toLocaleString(),
                    isDir: fs.lstatSync(path.join(dir, file)).isDirectory()
                }
                filesArr.push(fileObj)

            });

            if (err) throw err
            var obj = {
                files: filesArr,
                isDir: fs.lstatSync(dir).isDirectory(),
                path: "/",
                time: fs.lstatSync(dir).mtime.toLocaleString(),
                type: "dir"
            };
            return res.json(obj)
        })
    });

    router.get('/archive/*', function (req, res) {
        console.log("I am called");
        var decodedURI = decodeURI(req.url);
        var dirarr = decodedURI.split('/');
        var dirpath = path.join(dir, dirarr.slice(2).join("/"));
        console.log("dirpath: " + dirpath);
        var output = fs.createWriteStream(__dirname + '/7.zip');
        console.dir("out: ", output);
        var archive = archiver('zip', {
            zlib: {level: 9} // Sets the compression level.
        });
        archive.directory(dirpath, 'download');
        archive.on('error', function (err) {
            console.log(err);
        });
        res.setHeader("Content-Type", "application/zip");
        res.setHeader('Content-disposition', 'attachment; filename=downlaod.zip');
        archive.pipe(res);
        archive.on('finish', function () {
            console.log("finished zipping");

        });
        archive.finalize();

    });

    router.post('/upload', function (req, res) {

        console.log("dirpop: "+dirpop)
        var form = new formidable.IncomingForm();
        form.uploadDir = dirpop;
        form.keepExtensions = true;
        form.parse(req, function(err, fields, files) {
            res.redirect('/');
        });
        form.on('file', function(field, file) {
            //rename the incoming file to the file's name
            fs.rename(file.path, form.uploadDir + "/" + file.name);
        });
    });
    app.use('/', router);
};



