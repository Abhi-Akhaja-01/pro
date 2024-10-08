if(process.env.NODE_ENV != "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const port=8080;
const mongoose = require("mongoose");

// const Listing = require("./models/listing.js");
// const Review= require("./models/review.js");

const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

// const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
// const {listingSchema, reviewSchema} = require("./schema.js")
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User=require("./models/user.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dburl = process.env.ATLASDB_URL;

main()
    .then((res) => {
        console.log("connected to db");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(dburl);
}

const session = require("express-session");
const MongoStore = require("connect-mongo");

const store = MongoStore.create({
    mongoUrl: dburl,
    crypto: {
        secret: process.env.SECRET, 
    },
    touchAfter: 24 * 3600,
});

store.on("error", ()=> {
    console.log("ERROR in MONGO SESSION STORE",err);
});

const sessionOption = {
    store,
    secret:  process.env.SECRET, 
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 10000,
        maxAge: 7 * 24 * 60 * 60 * 10000,
        httpOnly: true,
    },
};
app.use(session(sessionOption));



const flash = require("connect-flash");
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// app.get("/demouser", async(req,res) => {
//     let fackUser = new User({
//         email: "student@gmail.com",
//         username: "delta-student",
//     });

//     let registeredUser = await User.register(fackUser,"helloworld");
//     res.send(registeredUser);
// })



const listingsRouter = require("./router/listing.js");
const reviewsRouter = require("./router/review.js")
const userRouter = require("./router/user.js");

const user = require("./models/user.js");



app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);

// app.get("/", (req,res) => {
//     res.send("done");
// }); 

// test one document check only localhost:8080/testListing

// app.get("/testListing", async(req,res) => {
//     let sampleListing = new Listing({
//         title: "my new villa",
//         description: "by the beach",
//         price: 1200,
//         location: "calangute, goa",
//         country: "india"
//     });
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful testing");
// });


app.all("*",(req,res,next) => {
    next(new ExpressError(404, "page not found"));
});

app.use((err,req,res,next)=> {
    let { statuscode=500, message="Something went wrong" } = err;
    res.status(statuscode).render("error.ejs", { err });
  //  res.status(statuscode).send(message);
 // res.send("Something went wrong");
});

app.listen(port, () => {
    console.log("server is listening to port 8080");
})


