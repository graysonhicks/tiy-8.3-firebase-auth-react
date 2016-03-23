window.jQuery = $ = require('jquery');
var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var _ = require('underscore');
var Backbone = require('backbone');
require('backbone-react-component');
var Firebase = require("firebase");
var ReactFireMixin = require("reactfire");



var LoginComponent = React.createClass({
  mixins: [Backbone.React.Component.mixin, ReactFireMixin],
  getInitialState: function(){
    return {
        email: '',
        password: ''
      }
  },
  handlePassword: function(event){
    this.setState({'password': event.target.value });
  },
  handleEmail: function(event){
    this.setState({'email': event.target.value });
  },
  handleSubmit: function(event){
    event.preventDefault();
    this.props.login(this.state.email, this.state.password);
  },
  render: function(){
    return (
      <form onSubmit={this.handleSubmit}>
        <h1>Login</h1>
        <fieldset className="form-group">
          <label htmlFor="exampleInputEmail1">Email address</label>
          <input type="email" name="email" onChange={this.handleEmail} className="form-control" value={this.state.email} id="loginemail" placeholder="Enter email" />
        </fieldset>
        <fieldset className="form-group">
          <label htmlFor="exampleInputPassword1">Password</label>
          <input type="password" name="password" onChange={this.handlePassword} className="form-control" value={this.state.password} id="loginpassword" placeholder="Password" />
        </fieldset>
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
    )
    }
  });


var SignUpComponent = React.createClass({
  mixins: [Backbone.React.Component.mixin, ReactFireMixin],
  getInitialState: function(){
    return {
        email: '',
        password: ''
      }
  },
  handlePassword: function(event){
    this.setState({'password': event.target.value });
  },
  handleEmail: function(event){
    this.setState({'email': event.target.value });
  },
  handleSubmit: function(event){
    event.preventDefault();
    this.props.createUser(this.state.email, this.state.password);
  },
  render: function(){
    return (
      <form onSubmit={this.handleSubmit}>
        <h1>No Account? Sign up here.</h1>
        <fieldset className="form-group">
          <label htmlFor="exampleInputEmail1">Email address</label>
          <input type="email" name="email" onChange={this.handleEmail} className="form-control" value={this.state.email} id="signupemail" placeholder="Enter email" />
        </fieldset>
        <fieldset className="form-group">
          <label htmlFor="exampleInputPassword1">Password</label>
          <input type="password" name="password" onChange={this.handlePassword} className="form-control" value={this.state.password} id="loginpassword" placeholder="Password" />
        </fieldset>
        <button type="submit" className="btn btn-success">Sign Up!</button>
      </form>
    )
    }
  });

var MessageComponent = React.createClass({
  mixins: [Backbone.React.Component.mixin, ReactFireMixin],
 getInitialState: function(){
  return {
    message: ''
  }
  },
  handleMessage: function(e){
    e.preventDefault();
    this.setState({message: e.target.value});
  },
  handleMessageSubmit: function(e){
    e.preventDefault();
    var message = this.state.message;
    this.props.handleMessageSubmit(message);
    this.setState({'message': ''});
  },
  render: function(){
    var messages = this.props.messages.map(function(message){
      return (
        <div key={message.key}>
          {message.message}
        </div>);
    });
    return (
        <form onSubmit={this.handleMessageSubmit}>
          <h1>Send a message.</h1>
          <div>{messages}</div>
          <fieldset className="form-group">
            <label htmlFor="exampleTextarea">Put your message here:</label>
            <input className="form-control" onChange={this.handleMessage} value={this.state.message} id="messageinput" />
          </fieldset>
          <button type="submit" className="btn btn-default">Send</button>
        </form>
     )
    }
  });

var PageComponent = React.createClass({
  mixins: [Backbone.React.Component.mixin, ReactFireMixin],
  getInitialState: function(){
    return {
      router: this.props.router
    }
  },
  componentWillMount: function(){
    this.callback = (function(){
      this.forceUpdate();
    }).bind(this);
    this.state.router.on('route', this.callback);
    this.firebaseRef = new Firebase("https://glowing-heat-3389.firebaseio.com/");
    this.bindAsArray(new Firebase("https://glowing-heat-3389.firebaseio.com/messages/"), "messages");
  },
  componentWillUnmount: function(){
    this.state.router.off('route', this.callback);
  },
  login: function(email, password){
    this.firebaseRef.authWithPassword({'email': email, 'password': password},
      function(error, authData) {
        if (error) {
          console.log("Login Failed!", error);
          this.setState({'alert': 'Login Failed!', 'alertClass': 'alert-danger'});
        } else {
          this.setState({'auth': authData});
          Backbone.history.navigate('message', {trigger: true});
        }
      }.bind(this));
  },
  createUser: function(email, password){
    this.firebaseRef.createUser({'email': email, 'password': password},
      function(error, userData){
        if(error){
          switch (error.code) {
            case "EMAIL_TAKEN":
              this.setState({'alert': 'Email Already In Use!', 'alertClass': 'alert-danger'});
              break;
            case "INVALID_EMAIL":
              this.setState({'alert': 'Not a Valid Email!', 'alertClass': 'alert-danger'});
              break;
            default:
              this.setState({'alert': 'Account Creation Failed! Please Try Again!', 'alertClass': 'alert-danger'});
          }
        }else{
          this.setState({'alert': 'Account Created Successfully! Go Login Now', 'alertClass': 'alert-success'});
        }
      }.bind(this));
  },
  handleMessageSubmit: function(message) {
    this.firebaseRefs["messages"].push({
      message: message
    });
    this.setState({message: ""});
  },
  render: function(){
    var alert, alertClass;
    if(this.state.alert){
      alert = this.state.alert;
      alertClass = "alert " + this.state.alertClass;
    }
    if(this.state.router.current == "index"){
      return (
        <div>
          <div className="container">
            <div className="row">
              <div className="col-md-6" id="logincontainer">
                <LoginComponent login={this.login} />
              </div>
              <div className="col-md-6" id="signupcontainer">
                <SignUpComponent createUser={this.createUser}/>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 col-md-offset-3">
                <div className={alertClass} role="alert">
                  {alert}
                </div>
              </div>
            </div>
          </div>
        </div>

      );
    }
    if(this.state.router.current == "message"){
      return (
        <div className="container">
          <div className="row">
            <div className="col-md-6 col-md-offset-3" id="messagecomponent">
              <MessageComponent handleMessageSubmit={this.handleMessageSubmit} messages={this.state.messages}/>
            </div>
          </div>
        </div>
       )
    }

  }

  });



module.exports = {PageComponent: PageComponent}
