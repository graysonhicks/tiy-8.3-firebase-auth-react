window.jQuery = $ = require('jquery');
var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var _ = require('underscore');
var Backbone = require('backbone');
require('backbone-react-component');
var Firebase = require("firebase");
var ReactFireMixin = require("reactfire");

var router = require('./router.js');

var PageComponent = require('./components.jsx').PageComponent;

$(function(){
  Backbone.history.start();
  
  ReactDOM.render(
    React.createElement(PageComponent, {
      router: router
    }),
    document.getElementById('main-container')
    );
});
