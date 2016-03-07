'use strict'

// Using authentication:
var wfs = require('./source/index.js')(
        'http://owncloud-31vh75j1.cloudapp.net/owncloud/remote.php/webdav/',
        'luis',
        'luis123'
    );

// esta%20%c3%a7%c3%a3o%c3%a3o%c3%81%c3%80%c3%a0%c3%a0

// wfs.readdir('/', {extended: true}, function(err, contents) {
//     if (!err) {
//         console.log('Dir contents:', contents);
//     } else {
//         console.log('Error:', err.message);
//     }
// });

// wfs.writeFile("teste.txt", "This is a saved file! REALLY!!", function(err) {
//     console.error(err.message);
// });

var fs = require('fs');
// var url_to_file = 'http://luis:luis123@owncloud-31vh75j1.cloudapp.net/owncloud/remote.php/webdav/paper.pdf';
var req = require('./source/requests');

var options = {
    hostname: 'owncloud-31vh75j1.cloudapp.net',
    port: '80',
    path: '/owncloud/remote.php/webdav/paper2.pdf',
    auth: 'luis:luis123',
    method: 'PUT'
};

// req.request(options, "coiso").then(function(){
//     console.log('done');
// }).catch(function(err){
//     console.log(err);
// });

// var data1 = fs.createReadStream('paper.pdf');
// var data = fs.createWriteStream('paper2.pdf');
fs.readFile('paper.pdf', function(err, data){
    req.request(options, data).then(function(){
        console.log('done');
    }).catch(function(err){
        console.log(err);
    });
});
