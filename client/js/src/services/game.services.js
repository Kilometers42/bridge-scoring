angular.module('game.services', [])
.factory('game.services.save', function($resource) {
  return $resource('allGames/create', {}, {
      post: {
        method:"POST",
        isArray: false,
      }
    });
})
.factory('game.services.selected', function(){
  return  {id: '', callback: ''};  
})
.factory('game.services.getGame', function($resource){
  return $resource('game/read')
});