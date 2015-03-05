var Backbone 	= require('backbone'),
	Marionette	= require('backbone.marionette'),
	_			= require('lodash'),
	letterTemplate = require('../../tmpl/letter.hbs');
	gameTemplate = require('../../tmpl/game.hbs');

var LetterView = Backbone.Marionette.ItemView.extend({
	template: letterTemplate,
	className: 'letter',

	modelEvents: {
		"change:x" : "move",
		"change:y" : "move"
	},

	onBeforeRender: function() {
		this.move();
	},

	move: function() {
		this.$el.offset({
			left: this.model.get('x'),
			top: this.model.get('y')
		});
	}
});

var GameView = Backbone.Marionette.CompositeView.extend({
	childView: LetterView,
	template: gameTemplate,
	childViewContainer: ".playarea",
	className: 'board',

	modelEvents: {
		"change:tickRate" : "setupTick",
		"change:creationRate" : "setupCreation",
		"change:score" : "onScoreChange"
	},

	initialize: function() {
		this.collection = new Backbone.Collection();
	},

	onRender: function() {
		this.setupTick();
		this.setupCreation();
		$(document).keydown(_.bind(this.onKeypress, this));
	},

	setupTick: function() {
		if (this.tick) {
			clearInterval(this.tick);
		}
		this.tick = setInterval(_.bind(this.tick, this), this.model.get('tickRate'))
	},

	setupCreation: function() {
		if (this.creation) {
			clearInterval(this.creation);
		}
		this.creation = setInterval(_.bind(this.createLetter, this), this.model.get('creationRate'))
	},

	tick: function() {
		this.collection.each(function(m) {
			m.set("x", m.get("x") + this.model.get("letterSpeed"));
			if (m.get('x') > this.$el.outerWidth()) {
				window.app.trigger("gameover", this.model);
			}
		}, this);
	},

	createLetter: function() {
			this.collection.add(new Backbone.Model({
				letter: this.getRandomLetter(),
				y: Math.random() * (this.getChildViewContainer(this).height() - 50),
				x: -50
			}));
	},

	getRandomLetter: function() {
		var letters = this.model.get('letters');
		return letters.charAt(Math.floor(Math.random()*letters.length));
	},

	onKeypress: function(e) {
		if (e.keyCode === 27) {
			window.app.trigger("gameover", this.model);
			return;
		}

		var letter = this.collection.findWhere({letter: String.fromCharCode(e.keyCode).toLowerCase()});
		if (letter) {
			this.collection.remove(letter);
			var score = this.model.get('score');
			score++;
			this.model.set('score', score);
			if (score % 20 == 0) {
				this.model.set('creationRate', this.model.get('creationRate')*.9);
			}
		} else {
			this.model.set('score', this.model.get('score') - 1);
		}
	},

	onScoreChange: function() {
		var score = this.model.get('score');
		this.$el.find('span.score').html(score);
	},

	onDestroy: function() {
		clearInterval(this.creation);
		clearInterval(this.tick);
	}


});


module.exports = GameView;