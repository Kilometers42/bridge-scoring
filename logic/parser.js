var cheerio = require('cheerio');
var request = require('request');
var mongoose = require('mongoose');
var analyzer = require('../logic/analyzer.js');
var GameModel = require('../Models/GameModel.js')

module.exports = { 
    parse: function (newGame, cb){
      var game = new GameModel({});
      game.boards = [];
      game._id = mongoose.Types.ObjectId();
      request(newGame.url, function (error, response, html) {
        if (!error && response.statusCode == 200) {
          var $ = cheerio.load(html);
          var doubleDummyHtml = $('.bcdda');
          var resultsHtml = $('table.bcst');
          var handHtml = $('table.bchand').find('tr');
          for(var i = 0; i < doubleDummyHtml.length; i++ ){
            var board = {number: i + 1, result:{}};
            board.result =  NodeTree(resultsHtml[i].children, ResultsTableObject, true);
            var x =  NodeTree(doubleDummyHtml[i].children, DoubleDummyObject);
            board.doubleDummy = x;
            setDealerVul(board, i);
            game.boards[i+1] = board;
          }
          createHands(game, handHtml);
        }
        game.url = newGame.url;
        analyzer.analyze(setupTeam(game, newGame.number, newGame.direction), function(){cb(game)});
      });
    }

};


function createHands(game, handHtml){
  var boardCounter = 0;
  var hand;
  for (var i = 0; i < handHtml.length; i++ ) {
    switch(i%16){
      case 0:
        boardCounter++;
        game.boards[boardCounter].nHand ={}
        hand = game.boards[boardCounter].nHand
        break;
      case 4:
        game.boards[boardCounter].wHand ={}
        hand = game.boards[boardCounter].wHand
        break;
      case 8:
        game.boards[boardCounter].eHand ={}
        hand = game.boards[boardCounter].eHand
        break;
      case 12:
        game.boards[boardCounter].sHand ={}
        hand = game.boards[boardCounter].sHand
        break;
    }
    switch (i%4) {
      case 0:
        hand.spades = NodeTree(handHtml[i].children, cleanSuit);
        break;
      case 1:
        hand.hearts = NodeTree(handHtml[i].children, cleanSuit);
        break;
      case 2:
        hand.diamonds = NodeTree(handHtml[i].children, cleanSuit);
        break;
      case 3:
        hand.clubs = NodeTree(handHtml[i].children, cleanSuit);
        break;
    } 
  }
}


function setDealerVul(board, boardNumber){
  switch (boardNumber%4) {
    case 0:
      board.dealer = 'North';
      board.vulnerable = 'None';
      break;
    case 1:
      board.dealer = 'East';
      board.vulnerable = 'North South';
      break;
    case 2:
      board.dealer = 'South';
      board.vulnerable = 'East West';
      break;
    case 3:
      board.dealer = 'West';
      board.vulnerable = 'All';
      break;
  }
}

function cleanSuit(suit){
  suit = suit.replace(/[♠♥♦♣]/g,"");
  suit = suit.trim();
  return suit.split(' ');
}


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
  var directionNumber, directionLetters;
  var firstTime = true;
  game.direction = direction;
  if (direction.match(/[NS]/)!== null) {
    directionNumber = 0; 
    directionLetters = 'NS';
  } else {
    directionNumber = 1;
    directionLetters = 'EW';
  }
  for (var i in game.boards) {
    var curBoard = game.boards[i];
    curBoard.playersDirection = directionLetters;
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
            curBoard.lead = curBoard.lead.replace(/\s/g,' ')
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