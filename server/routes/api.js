//Thanks to Matthias Dolstra for helping me setup the server

var fs = require('fs'),
    express = require('express'),
    router = express.Router(),
    jsonfile = require('jsonfile'),
    moment = require('momentjs'),
    getLastObject = require('../methods/methods.js');

router.post('/', function(req, res) {
    var file = 'resources/data.json',
        now = moment().format('YYYY-MM-DD HH:mm:ss');

    jsonfile.readFile(file, function(err, obj) {
        var lastObject = getLastObject(obj),
            motionValue = JSON.parse(req.body.input) + JSON.parse(lastObject.input.motion);

        var maximumMovement = 7;
        var minimumMovement = 3;

        if (motionValue <= minimumMovement) {
          var ledValue = "green";
        } else if (motionValue >= maximumMovement) {
          var ledValue = "red";
        } else {
          var ledValue = "white";
        }

        var  newdata = {
                time: now,
                input: {
                    motion: motionValue
                },
                output: {
                    led: req.body.output || ledValue
                }
            };

        obj.push(newdata);
        jsonfile.writeFileSync(file, obj);
        res.redirect('/');
    });
});

router.get('/status/input', function(req, res) {
    var file = 'resources/data.json';

    jsonfile.readFile(file, function(err, obj) {
        var pirValue = getLastObject(obj).input.motion;
        var amountPir = 0;

        res.send('{"motion":"' + pirValue + '"}');
    });
});

router.get('/status/output', function(req, res) {
    var file = 'resources/data.json';



    jsonfile.readFile(file, function(err, obj) {
        res.send('{"led":"' + getLastObject(obj).output.led + '"}');
    });
});

router.get('/data/', function(req, res) {
    var name = req.params.name;
    var file = 'resources/data.json';

    jsonfile.readFile(file, function(err, obj) {
        res.send(obj);
    });
});

module.exports = router;
