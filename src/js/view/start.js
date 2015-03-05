var Backbone 	= require('backbone'),
	Marionette 	= require('backbone.marionette'),
	template 	= require('../../tmpl/start.hbs');

var StartView = Backbone.Marionette.ItemView.extend({
	template: template,
	events: {
		"click button#start" : function() {
			this.trigger("start");
		}
	}
})


module.exports = StartView;