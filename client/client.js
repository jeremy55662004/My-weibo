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
		"reg": "reg",
		"logout": "logout"
	},
	index: function(){
		Session.set("currentUrl", {index: "active", login: "", reg: ""});
	},
	login: function(){
		if(Meteor.userId()){
			this.navigate("/", true);
			Session.set("info", {success: "", error: "user is online"});
			return;
		}
		Session.set("currentUrl", {index: "", login: "active", reg: ""});
	},
	reg: function(){
		if(Meteor.userId()){
			this.navigate("/", true);
			Session.set("info", {success: "", error: "user is online"});
			return;
		}
		Session.set("currentUrl", {index: "", login: "", reg: "active"});
	},
	logout: function(){
		if(Meteor.userId()){
			Meteor.logout();
			this.navigate("/", true);
			Session.set("info", {success: "", error: "user is online"});
		} else {
			this.navigate("/", true);
			Session.set("info", {success: "", error: "user is not online"});
		}
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

Template.login.events({
	'click #submit': function(evt){
		evt.preventDefault();
		var $username = $("#username").val();
		var $password = $("#password").val();
		if($password.length ===0 || $username.length ===0){
			Session.set("info", {success: "", error: "User name or password can't be empty"});
			return;
		}
		Meteor.loginWithPassword($username, $password, function(err){
			if(err){
				Session.set("info", {success: "", error: err.reason});
			} else {
				Router.redirect("/");
				Session.set("info", {success: "Login successfully", error: ""});
			}
		});
	}
});

Posts = new Meteor.Collection("posts");

Template.index.events({
  'click #submit': function (evt) {
    evt.preventDefault();
    var $post = $("#post").val();
    if ($post.length ===0 || $post.length >=140) {
      Session.set("info", {success: "", error: "The word number pleases limit at 140 word including"});
      return;
    }
    Posts.insert({user: Meteor.user(), post: $post, time: new Date()}, function (err) {
      if (err) {
        Session.set("info", {success: "", error: err.reason});
      } else {
        Session.set("info", {success: "Post successfully !", error: ""});
        $("#post").val("");
      }
    });
  }
});

Template.index.posts = function (){
	return Posts.find({}, {sort: {time: -1}});
}