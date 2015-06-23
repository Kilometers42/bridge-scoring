var mongoose = require('mongoose');
var ObjectId = mongoose.ObjectId;
var GameModel = require('../Models/GameModel.js')

var db = mongoose.connect('mongodb://' + process.env.IP + '/test');
// var MilesDB = db.collection('MilesDB');

//MilesDB.save({created: 'now'});

module.exports = {
    readBoards: function (id,cb){
        GameModel.find({_id: id.id},function(err, docs) {
        console.log(err);
        console.log(docs);
        cb(docs);
        });
    },
    save: function(item, cb){
        item.save( function(err){
        console.log(err);
        cb();
        });
    },
    updateBoard: function(item, cb){
        GameModel.find({boards:{$elemMatch:{number: item.number, teams: item.teams}}},function(err, docs){
            console.log(err);
            console.log(docs);
            if(typeof docs[0].boards[item.number] !== 'undefined'){
                item.result = docs[0].boards[item.number].result;
            }
            docs[0].boards[item.number] = item;
            GameModel.update({},docs[0], function(err, docs){
                console.log(err);
                console.log(docs);
                cb(docs);
            })
        });
    },
    readAll: function (cb){
        GameModel.find({}, {direction: 1, team: 1, url: 1},function(err, docs) {
        console.log(err);
        console.log(docs);
        cb(docs);
        });
    },

}