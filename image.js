var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ImgSchema   = new Schema({
    label: String, 
    image: Buffer
});

module.exports = mongoose.model('Image', ImgSchema);
