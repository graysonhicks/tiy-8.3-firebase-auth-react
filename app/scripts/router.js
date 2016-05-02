var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var _ = require('underscore');
var Backbone = require('backbone');
require('backbone-react-component');

var Router = Backbone.Router.extend({
  routes: {
    "": "index",
    "message": "message"
  },
  index: function(){
      this.current = "index";
    },
  message: function(){
      this.current = "message";
    }
  });

module.exports = new Router();
