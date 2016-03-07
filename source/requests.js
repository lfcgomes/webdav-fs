(function(module) {

    "use strict";
    var bluebird = require('bluebird'),
        http = require('http');

    function getRequest(destination, stream, callback){

        var request,
            toStream = false;

        if(typeof stream === 'function'){
            callback = stream;
            stream = null;
        }
        
        if(stream && (stream.pipe instanceof Function)){
            var toStream = true;
        }

        request = http.request(destination, function(res){

            var buff = [];

            if(toStream)
                res.pipe(stream);
            else{
                res.on('data', function(data){
                    buff.push(data);
                });
            }
            res.on('end', function(){
                if(toStream)
                    callback();
                else{
                    buff = concatBuffers(buff);
                    callback(null, buff);
                }
            })
        });
        
        request.on("response", function (res) {
            if (res.statusCode >= 400) {
                res.on("end", function () {
                    callback(new Error("HTTP " + verb + " failed with code " + res.statusCode + " for " + JSON.stringify(destination)));
                });
            }
            res.resume();
        });

        request.on("error", function (error) {
            callback(error);
        });
        request.end();
    }


    function putRequest(destination, file, callback){
        console.log('req 1');
        var request,
            fromBuffer = false;
        
        if(!file){
            callback(new Error('file argument cannot be null'));
            return;
        }

        //Check if file is not a readStream!
        if (!(file.pipe instanceof Function)){
            console.log('req 2');
            fromBuffer = true;
            destination.headers = {"Content-Length": file.length};
        }

        request = http.request(destination);
        
        request.on("response", function (res) {

            if (res.statusCode >= 400) {
                res.on("end", function () {
                    callback(new Error("HTTP " + destination.method + " failed with code " + res.statusCode + " for " + JSON.stringify(destination)));
                });
            }

            res.on('end', function(){
                console.log('req end');
                // callback();
            });
            // suck stream in
            res.resume();
        });

        request.on("error", function (error) {
            console.log('req 4');
            console.log(error);
            callback(error);
        });

        request.on('end', function(){
            console.log('req end');
            callback();
        });

        if(fromBuffer)
            request.write(file);
        else
            file.pipe(request);
        
        request.end();
    }

    function concatBuffers(bufs) {
        var buffer,
            length = 0,
            index  = 0;

        if (!Array.isArray(bufs))
            bufs = Array.prototype.slice.call(arguments);

        for (var i = 0, l = bufs.length; i < l; ++i) {
            buffer = bufs[i];
            if (!buffer)
                continue;

            if (!Buffer.isBuffer(buffer))
                buffer = bufs[i] = new Buffer(buffer);
            length += buffer.length;
        }
        buffer = new Buffer(length);

        bufs.forEach(function(buf, i) {
            buf = bufs[i];
            buf.copy(buffer, index, 0, buf.length);
            index += buf.length;
            delete bufs[i];
        });

        return buffer;
    };

    module.exports = {

        request: function(destination, file, callback) {
            
            if(typeof file === 'function'){
                callback = file;
                file = null;
            }

            switch(destination.method){
                case 'GET':{
                    return bluebird.promisify(getRequest)(destination, file);
                    break;
                }
                case 'PUT':{
                    return bluebird.promisify(putRequest)(destination, file);
                    break;
                }
                default:
                    console.log('none!');
            }  
        }
    };

})(module);