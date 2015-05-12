var mongojs = require('mongojs');
var ObjectId = mongojs.ObjectId;
var db = mongojs('mongodb://' + process.env.IP + '/test');
var MilesDB = db.collection('MilesDB');

//MilesDB.save({created: 'now'});
module.exports = {
    readBoards: function (id,cb){
        MilesDB.find({_id: ObjectId(id.id)},function(err, docs) {
        console.log(err);
        console.log(docs);
        cb(docs);
        });
    },
    save: function(item, cb){
        MilesDB.save(item, function(err){
        console.log(err);
        cb();
        });
    },
    updateBoard: function(item, cb){
        MilesDB.find({boards:{$elemMatch:{number: item.number, teams: item.teams}}},function(err, docs){
            console.log(err);
            console.log(docs);
            if(typeof docs[0].boards[item.number] !== 'undefined'){
                item.result = docs[0].boards[item.number].result;
            }
            docs[0].boards[item.number] = item;
            MilesDB.update({},docs[0], function(err, docs){
                console.log(err);
                console.log(docs);
                cb(docs);
            })
        });
    },
    readAll: function (cb){
        MilesDB.find({}, {direction: 1, team: 1, url: 1},function(err, docs) {
        console.log(err);
        console.log(docs);
        cb(docs);
        });
    },

}