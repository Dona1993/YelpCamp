var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");

router.get("/", function(req, res){
	res.render("landing");
});

//  AUTH ROUTES

//show sign up form
router.get("/register", function(req, res){
	res.render("register");
});

// handle sign up logic
router.post("/register", function(req, res){
	var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){ //User.register is provided by passport
        if(err){
			req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function(){
		   req.flash("success", "Welcome to YelpCamp" + user.username);
           res.redirect("/campgrounds");
        });
    });
});

//LOGIN ROUTES

//render login form
router.get("/login", function(req, res){
	res.render("login");
});

//Handling login logic

//SYNTAX: app.post("/login", middleware, callback fn)
router.post("/login", passport.authenticate("local", 
	{
		successRedirect: "/campgrounds",
		failureRedirect: "/login"
	}), function(req, res){ //this callback is not necessary though
});

//Logout logic

router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "logged you out!");
	res.redirect("/campgrounds");
});

module.exports = router;