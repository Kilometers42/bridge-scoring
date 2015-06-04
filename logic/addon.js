var addon = require('./build/Release/addon')

var hand= "[Deal \"N:95.984.AKJ75.953 QJ762.J72.T6.J74 KT43.AKQ.Q9.AK62 A8.T653.8432.QT8\"]";
var leader = 1;
var contract = "4H";
addon(hand,leader,contract,function(msg){
    console.log(msg);
    console.log(msg[2]);
    var arr = Object.keys(msg).map(function(k) { return msg[k] });

    console.log(arr)
})