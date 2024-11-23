if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
}

// Import required modules //mvc -model views controller
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./Utilis/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");



// Import route handlers
const listingRouter = require("./Routes/Listing.js");
const reviewRouter = require("./Routes/Review.js");
const userRouter = require("./Routes/user.js");
const { findByUsername } = require("./models/review.js");

// MongoDB connection URL
const MONGO_URL = "mongodb://127.0.0.1:27017/Wanderlust";

// Connect to MongoDB
main()
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

// Async function for MongoDB connection
async function main() {
    await mongoose.connect(MONGO_URL);
}

// Set EJS as the view engine and configure views directory
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware setup
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data
app.use(methodOverride("_method")); // Support for HTTP method override
app.engine("ejs", ejsMate); // Use EJS-Mate as the template engine
app.use(express.static(path.join(__dirname, "/Public"))); // Serve static files

// Session configuration
const SessionOptions = {
    secret: "mysuperscretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // Cookie expires in 7 days
        maxAge: 7 * 24 * 60 * 60 * 1000, // Maximum age for cookie
        httpOnly: true, // Cookie accessible only by web server
    },
};

// Use session and flash middleware
app.use(session(SessionOptions));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash message middleware to set local variables for success messages
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user ;
    next();
});


// app.get("/demouser" ,async (req,res) => {
//     let fakeuser = new User({
//         email:"ompagal@gadha.com" ,
//         username:"botOm"
//     })
//     let registeredUser = await User.register(fakeuser, "faltu-om");
//     res.send(registeredUser);
// })

// Route handlers
app.use("/Listings", listingRouter); // Routes for listings
app.use("/Listings/:id/Review", reviewRouter); // Routes for reviews
app.use("/",userRouter);

// Root route handler
app.get("/", (req, res) => {
    res.send("Hi, I am the root server");
});

// Catch-all route for handling 404 errors
app.use("*", (req, res, next) => {
    next(new ExpressError(404, "Page not Found!!!"));
});

// Error handling middleware
app.use((err, req, res, next) => {
    let { statuscode = 500, message = "Something went wrong" } = err;
    res.status(statuscode).render("Listing/error.ejs", { message });
});


// Start the server
app.listen(8080, () => {
    console.log("Server is listening on port 8080");
});

