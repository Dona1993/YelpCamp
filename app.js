var express 		= require("express"),
 	app 			= express(),
 	bodyParser		= require("body-parser"),
 	mongoose 		= require("mongoose"),
	passport 		= require("passport"),
	flash 			= require("connect-flash"),
	LocalStrategy	= require("passport-local"),
	methodOverride  = require("method-override"),
	Campground 		= require("./models/campground"),
	Comment			= require("./models/comment"),
	User			= require("./models/user"),
	seedDB 			= require("./seeds");

//requiring routes
var commentRoutes = require("./routes/comments"),
	campgroundRoutes = require("./routes/campgrounds"),
	indexRoutes = require("./routes/index");

mongoose.connect("mongodb://localhost:27017/yelp_camp_v111", { useNewUrlParser: true });
// mongoose.connect("mongodb+srv://Donitha:Demodon24@don@cluster0-umq8y.mongodb.net/test?retryWrites=true&w=majority", {
// 	useNewUrlParser: true,
// 	useCreateIndex: true
// }).then(() => {
// 	console.log("Connected to DB!");
// }).catch(err =>{
// 	console.log("ERROR: ", err.message);
// });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB(); 

//PASSPORT CONFIGURATION   (+++few lines in user.js too+++) passport is amongoose package
app.use(require("express-session")({ //requiring and using in one swoop
	secret: "Bobo is the cutest dog in the world",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//user middleware
app.use(function(req, res, next){
   res.locals.currentUser = req.user;// req.user is from passport which contains all the user info
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
   next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});