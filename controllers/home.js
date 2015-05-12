var express = require("express");
var router = express.Router();

router.get('/', function(request, response){
    response.render('index', {name: 'miles'});
});

module.exports = router;