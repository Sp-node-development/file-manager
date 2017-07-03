/**
 * Created by ADMIN on 7/3/2017.
 */
var formidable = require('formidable'),
    http = require('http'),
    util = require('util'),
    fs = require('fs')
var mkdirp = require('mkdirp');

mkdirp('./tmp/foo/bar/baz', function (err) {
    if (err) console.error(err)
    else console.log('pow!')
});
http.createServer(function(req, res) {
    if (req.url == '/upload' && req.method.toLowerCase() == 'post') {
        // parse a file upload
        var form = new formidable.IncomingForm();
        form.uploadDir = "./tmp/foo/bar/baz";
        form.keepExtensions = true;

        form.parse(req, function(err, fields, files) {
            console.log(files.name)
            res.writeHead(200, {'content-type': 'text/plain'});
            res.write('received upload:\n\n');
            res.end(util.inspect({fields: fields, files: files}));
        });
        form.on('file', function(field, file) {
            //rename the incoming file to the file's name
            fs.rename(file.path, form.uploadDir + "/" + file.name);
        });
        return;
    }

    // show a file upload form
    res.writeHead(200, {'content-type': 'text/html'});
    res.end(
        '<form action="/upload" enctype="multipart/form-data" method="post">'+
        '<input type="text" name="title"><br>'+
        '<input type="file" name="upload"><br>'+
        '<input type="submit" value="Upload">'+
        '</form>'
    );
}).listen(8080);