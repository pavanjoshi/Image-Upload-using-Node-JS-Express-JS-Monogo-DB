// server.js

var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');

mongoose.connect('mongodb://localhost:27017/test');

var Image = require('./image');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
var router = express.Router();              // get an instance of the express Router

router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    res.header("Access-Control-Allow-Origin", "http://localhost");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    next(); 
});

router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

router.route('/images')

    .post(function(req, res) {
        
        var image = new Image();      // create a new instance of the Bear model
        image.label = req.body.label;  // set the bears name (comes from the request)
        image.image = req.body.image;
        console.log(req.body);
        image.save(function(err) {
            console.log("Saving image...");
            if (err)
                res.send(err);

            res.json({ message: 'Image created!' });
        });
        
    })

    .get(function(req, res) {
        Image.find(function(err, images) {
            console.log("Getting all images...");
            if (err)
                res.send(err);

            res.json(images);
        });
    })

    .delete(function(req, res) {
        Image.remove({
        }, function(err, image) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });

app.use('/api', router);

app.listen(port);
console.log('Magic happens on port ' + port);
