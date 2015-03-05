var	$ = window.$ = window.jQuery = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;
var Marionette = require('backbone.marionette');
var	bootstrap = require('bootstrap'),
	StartView 	= require('./view/start'),
	GameView 	= require('./view/game'),
	GameOverView 	= require('./view/gameover'),
	GameModel	= require('./model/game');


window.app = new Backbone.Marionette.Application();
 
window.app.addRegions({
	game: "#game"
});

window.app.addInitializer(function(options){
});

window.app.on('start', function() {
	startView = new StartView({});
	startView.on('start', function() {
		window.app.trigger('game');
	});
	app.game.show(startView);
});

window.app.on('game', function() {
	var gameView = new GameView({
		model: new GameModel()
	})
	app.game.show(gameView);
});

window.app.on('gameover', function(gameModel) {
	gameOverView = new GameOverView({model: gameModel});
	gameOverView.on('start', function() {
		window.app.trigger('game');
	});
	app.game.show(gameOverView)
});

window.app.start();