var fs = require('fs'),
    express = require('express'),
    router = express.Router(),
    jsonfile = require('jsonfile'),
    moment = require('momentjs'),
    getLastObject = require('../methods/methods.js');

router.post('/', function(req, res) {
    var file = 'resources/data.json',
        now = moment().format('YYYY-MM-DD HH:mm:ss');

    // var maximumMovement = 7;
    // var minimumMovement = 3;

    // if (motionValue <= )

    jsonfile.readFile(file, function(err, obj) {
        var lastObject = getLastObject(obj),
            motionValue = JSON.parse(req.body.input) + JSON.parse(lastObject.input.motion),
            newdata = {
                time: now,
                input: {
                    motion: motionValue
                },
                output: {
                    led: req.body.output || lastObject.output.led
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
