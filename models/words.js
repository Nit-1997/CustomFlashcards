var mongoose    = require("mongoose");
var WordSchema = new mongoose.Schema({
    word           : String,
    meaning        : String,
    correct        : Number,
    incorrect      : Number,
    ciratio        : Number
});

module.exports = mongoose.model("Word",WordSchema);