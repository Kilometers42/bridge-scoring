var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var GameSchema = new Schema({
    url: String,
    direction: String,
    team: String,
    boards: Schema.Types.Mixed,
    _id: Schema.Types.ObjectId
    
}, { strict: false });

module.exports = mongoose.model('games', GameSchema);
