const   express         = require("express"),
        app             = express(),
        bodyParser      = require("body-parser"),
        mongoose        = require("mongoose"),
        flash           = require("connect-flash"),
        passport        = require("passport"),
        LocalStrategy   = require("passport-local"),
        methodOverride  = require("method-override"),
        Vtuberprofile   = require("./models/vtuberprofile"),
        Comment         = require("./models/comment"),
        User            = require("./models/user"),
        seedDB          = require("./seeds");

const   commentRoutes       = require("./routes/comments"),
        vtuberprofileRoutes = require("./routes/vtuberlist"),
        indexRoutes         = require("./routes/index");

// Seed the Database
// seedDB();

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

const uri = "mongodb+srv://xymiku:kaiku1019@yelpvtuber-3hsre.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(uri, {
    useNewUrlParser: true,
    useCreateIndex: true
}).then(() => {
    console.log("Connected to Database");
}).catch(err => {
    console.err("Error: " + err.message);
});
// mongoose.connect("mongodb://localhost/yelp_vtuber");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// Passport Configuration
app.use(require("express-session")({
    secret: "I Love Vtuber and I'm DD",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/vtuberlist/:id/comments", commentRoutes);
app.use("/vtuberlist", vtuberprofileRoutes);
app.use("/", indexRoutes);

app.listen(process.env.PORT || 3000, process.env.IP, () => {
    console.log("server started...");
});