var Backbone 	= require('backbone'),
	Marionette 	= require('backbone.marionette'),
	template 	= require('../../tmpl/gameover.hbs');

var GameOverView = Backbone.Marionette.ItemView.extend({
	template: template,
	events: {
		"click button#start" : function() {
			this.trigger("start");
		}
	}
})


module.exports = GameOverView;