
var cheerio = require('cheerio');
var request = require('request');
var analyzer = require('../logic/analyzer.js');



module.exports = { 
    parse: function (newGame, cb){
        var game = {boards: []};
        request(newGame.url, function (error, response, html) {
          
          if (!error && response.statusCode == 200) 
          {
            var $ = cheerio.load(html);
            var doubleDummyHtml = $('.bcdda');
            var resultsHtml = $('table.bcst');
            for(var i = 0; i < doubleDummyHtml.length; i++ )
            {
                var board = {number: i + 1, result:{}};
                board.result =  NodeTree(resultsHtml[i].children, ResultsTableObject, true);
                var x =  NodeTree(doubleDummyHtml[i].children, DoubleDummyObject);
                console.log(x);
                board.doubleDummy = x;
                game.boards[i+1] = board;
            }
          }
          game.url = newGame.url;
          analyzer.analyze(setupTeam(game, newGame.number, newGame.direction), function(){cb(game)});
        });
    }
};

function NodeTree(nodes, createObjectFunction, separators){
  separators = separators || false;
  var data = '';
  
  while(nodes.length != 0)
  {
    var x = nodes[0];
    nodes.shift();
    if (typeof(x.children) !== 'undefined')
    {
      nodes = x.children.concat(nodes);
    }
    else
    {
      if(separators)
      {
        data = data.concat(x.data + '~');
      }
      else
      {
        data = data.concat(x.data);
      }
    }
  }
  return createObjectFunction(data.trim());
}

function ResultsTableObject(tableString){
  var switchFunc;
  if (tableString.match(/Matchpoints/)) {
    switchFunc = matchPointSwitch;
  } else{
    switchFunc = noMatchPointSwitch;
  };
  tableString = '~'.concat(tableString);
  var rtObject = {table: []}
  var location = tableString.search(/~\d|~Pass/i);
  var body = tableString.substring(location);
  body = body.replace(/ ~/g, ' ');
  body = body.replace(/~ /g, ' '); 

  body = body.replace(/~×/g, '×');
  var rtArray = body.split(/~/)
  console.log(body);
  console.log(rtArray);
  rtArray.shift();
  var arrayLength = rtArray.length;
  var row = {};
  for(var i=1; i < arrayLength; i++){
    var item = rtArray[0];
    rtArray.shift();
    switchFunc(i,row, rtObject, rtArray, item)
  }
  return rtObject;
}

function noMatchPointSwitch(i,row, rtObject, rtArray, item){
   switch (i%7) {
      case 0:
        rtObject.table.push(new ResultsRow(row.contract, row.declarer, row.lead, row.made,row.score, '', '', row.teams))
        console.log(new ResultsRow(row.contract, row.declarer, row.lead, row.made, row.score, '', '', row.teams));  
      case 1:
        row.contract = item.replace(/\s/, '');
        if (row.contract == 'Pass')
        {
          console.log('h');
          
          rtArray.unshift(null,null,null,  0)
        }
        break;
      case 2:
        row.declarer = item;
        break;
      case 3:
        row.lead = item;
        break;
      case 4:
        row.made = item;
        break;
      case 5:
        row.score = item;
        break;
      case 6:
        row.teams = item;
        // nsPairNumber = teams.match(/\d+/)[0];
        // ewPairNumber = teams.match(/vs\s*\d+/).toString().match(/\d/)[0];
        break;
    }
}

function matchPointSwitch(i,row, rtObject, rtArray, item){
  switch (i%9) {
      case 0:
        rtObject.table.push(new ResultsRow(row.contract, row.declarer, row.lead, row.made,row.score, row.nsPoints, row.ewPoints, row.teams))
        console.log(new ResultsRow(row.contract, row.declarer, row.lead, row.made, row.score, row.nsPoints, row.ewPoints, row.teams));  
      case 1:
        row.contract = item.replace(/\s/, '');
        if (row.contract == 'Pass')
        {
          console.log('h');
          rtArray.shift()
          rtArray.unshift(null, null, null, 0)
        }
        break;
      case 2:
        row.declarer = item;
        break;
      case 3:
        row.lead = item;
        break;
      case 4:
        row.made = item;
        break;
      case 5:
        row.score = item;
        break;
      case 6:
        row.nsPoints = item;
        
        break;
      case 7:
        row.ewPoints = item;
        break;
      case 8:
        row.teams = item;
        // nsPairNumber = teams.match(/\d+/)[0];
        // ewPairNumber = teams.match(/vs\s*\d+/).toString().match(/\d/)[0];
        break;
    }
}

function ResultsRow(contract, declarer, lead, made, score, nsPoints, ewPoints, teams){
  this.contract = contract;
  this.declarer = declarer;
  this.lead = lead;
  this.made = made;
  this.score = score;
  this.nsPoints = nsPoints;
  this.ewPoints = ewPoints;
  this.teams = teams;
}

function ResultTable(nodes){
  var data = '';
  
  while(nodes.length != 0)
  {
    var x = nodes[0];
    nodes.shift();
    if (typeof(x.children) !== 'undefined')
    {
      nodes = x.children.concat(nodes);
    }
    else
    {
      data = data.concat(x.data + "~");
    }
  }
  var location = data.search(/((~\d))/i);
  var body = data.substring(location);
  body = body.replace(/\s~♦/g, ' ♦');
  body = body.replace(/\s~♥/g, ' ♥');
  body = body.replace(/♦~\s/g, '♦ ');
  body = body.replace(/♥~\s/g, '♥ ');
  console.log(body);
  console.log(body.split(/~/));
  return data.trim();
  
}

function DoubleDummyObject(ddString){
  var ddObject = {parScore: '', parContract: '', results: [] };
  var ddArray = ddString.split(/[;:]\s*/);
  // console.log(ddArray);
  if (ddArray[ddArray.length - 1][0] == 'P')
  {
    ddObject.parScore = ddArray.pop().split(/\s/)[1];
    ddObject.parContract = ddArray[0];
    
  }
  else{
    ddObject.parContract = ddArray.pop();
    ddObject.parScore = ddArray.pop().split(/\s/)[1];
  }
  ddObject.results = ddArray;
  return ddObject;
}

function setupTeam (game, number, direction) {
  var directionNumber;
  var firstTime = true;
  game.direction = direction;
  if (direction.match(/[NS]/)!== null) {
    directionNumber = 0;  
  } else {
    directionNumber = 1;
  }
  for (var i in game.boards) {
    var curBoard = game.boards[i];
    for (var x in curBoard.result.table) {
      var curTeams = curBoard.result.table[x].teams;
      curTeams=curTeams.split('vs ');
      try {
          if (curTeams[directionNumber].search('\\b' + number + '\\b') >= 0) {
            curBoard.contract = curBoard.result.table[x].contract;
            curBoard.declarer = curBoard.result.table[x].declarer;
            curBoard.ewPoints = curBoard.result.table[x].ewPoints;
            curBoard.lead = curBoard.result.table[x].lead;
            curBoard.made = curBoard.result.table[x].made;
            curBoard.nsPoints = curBoard.result.table[x].nsPoints;
            curBoard.score = curBoard.result.table[x].score;
            curBoard.teams = curBoard.result.table[x].teams;
            if (firstTime){
              game.team = curTeams[directionNumber];
              firstTime = false;
            }
        }
      } catch (e) {
        true
      }

    }
  }
  return game;
}