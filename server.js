// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');

mongoose.connect('mongodb://localhost:27017/test');

var Image = require('./model/image');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    res.header("Access-Control-Allow-Origin", "http://localhost");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

// more routes for our API will happen here

// on routes that end in /bears
// ----------------------------------------------------
router.route('/images')

    // create a bear (accessed at POST http://localhost:8080/api/bears)
    .post(function(req, res) {
        
        var image = new Image();      // create a new instance of the Bear model
        image.label = req.body.label;  // set the bears name (comes from the request)
        image.image = req.body.image;
        console.log(req.body);
        // save the bear and check for errors
        image.save(function(err) {
            console.log("Saving image...");
            if (err)
                res.send(err);

            res.json({ message: 'Image created!' });
        });
        
    })

    // get all the bears (accessed at GET http://localhost:8080/api/bears)
    .get(function(req, res) {
        Image.find(function(err, images) {
            console.log("Getting all images...");
            if (err)
                res.send(err);

            res.json(images);
        });
    })

    // delete the bear with this id (accessed at DELETE http://localhost:8080/api/bears/:bear_id)
    .delete(function(req, res) {
        Image.remove({
        }, function(err, image) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
