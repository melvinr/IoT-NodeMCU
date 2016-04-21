var fs = require('fs'),
    express = require('express'),
    router = express.Router(),
    jsonfile = require('jsonfile'),
    moment = require('momentjs'),
    getLastObject = require('../methods/methods.js');

router.get('/', function(req, res, next) {
  jsonfile.readFile('resources/data.json', function(err, obj) {
    if (err) {
        res.status(404);
        next();
    }

    res.render('main', {
        title: 'Status leds',
        description: 'On this page you can see the status of the leds',
        data: getLastObject(obj)
    });
  });
});

router.get('/chart', function(req, res, next) {
  jsonfile.readFile('resources/data.json', function(err, obj) {
    if (err) {
        res.status(404);
        next();
    }

    res.render('chart', {
        title: 'History',
        description: 'On this page you can see the motion history',
        data: getLastObject(obj)
    });
  });
});


module.exports = router;
