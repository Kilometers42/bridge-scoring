var addon = require('./build/Release/addon')

var hand= "[Deal \"N:AQ76.QT9754..AQ6 KJ432.83.J875.87 T98.2.KQ92.KJT52 5.AKJ6.AT643.943\"]";
var leader = 1;
var contract = "2H";
addon(hand,leader,contract,function(msg){
    console.log(msg);
    console.log(msg[2]);
    var arr = Object.keys(msg).map(function(k) { return msg[k] });

    console.log(arr)
})