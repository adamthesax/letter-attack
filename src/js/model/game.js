var Backbone = require('backbone');

var GameModel = Backbone.Model.extend({
	defaults: {
		tickRate: 100,
		creationRate: 1000,
		letterSpeed: 10,
		score: 0,
		letters: 'abcdefghijklmnopqrstuvwxyz'
	}
});

module.exports = GameModel;