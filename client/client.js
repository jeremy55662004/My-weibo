Session.setDefault("currentUrl", {index: "active", login: "", reg: ""});
Session.setDefault("info", {success:"", error: ""});

Template.info.info = function(){
	return Session.get("info");
};

Template.container.currentUrl = function (){
	return Session.get("currentUrl");
};

Template.nav.active = function (){
	return Session.get("currentUrl");
};


var urlRouter = Backbone.Router.extend({
	routes: {
		"": "index",
		"login": "login",
		"reg": "reg"
	},
	index: function(){
		Session.set("currentUrl", {index: "active", login: "", reg: ""});
	},
	login: function(){
		Session.set("currentUrl", {index: "", login: "active", reg: ""});
	},
	reg: function(){
		Session.set("currentUrl", {index: "", login: "", reg: "active"});
	},
	redirect: function(url){
		this.navigate(url, true);
	}
});

Router = new urlRouter;

Meteor.startup(function(){
	Backbone.history.start({pushState: true});
});

Template.reg.events({
  'click #submit': function (evt) {
    evt.preventDefault();
    var $username = $("#username").val();
    var $password = $("#password").val();
    var $password_repeat = $("#password-repeat").val();
    if ($password.length ===0 || $username.length ===0) {
      Session.set("info", {success: "", error: "User name or password can't be empty"});
      return;
    }
    if ($password !== $password_repeat) {
      Session.set("info", {success: "", error: "Password does not match"});
      return;
    }
    Accounts.createUser({username: $username, password: $password}, function (err) {
      if (err) {
        Session.set("info", {success: "", error: err.reason});
      } else {
        Router.redirect("/");
        Session.set("info", {success: "Register successfully !", error: ""});
      }
    });
  }
});