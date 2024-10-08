const express = require("express");
const app = express();
const users = require("./routes/user.js");
const posts = require("./routes/post.js");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");

app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"views"));

const sessionOption = {
    secret: "mysupersecretstring", 
    resave:false, 
    saveUninitialized:true
};

app.use(session(sessionOption));
app.use(flash());

app.use((req,res,next) => {
    res.locals.successmsg = req.flash("success");
    res.locals.errormsg = req.flash("error");
    next();
});

app.get("/register", (req, res) => { 
    let {name = "manav"} = req.query;
    req.session.name = name;
    if (name === "manav") {
         req.flash("error","user not registers");
    } else {
        req.flash("success","user registered successfully!");
    }
    console.log(req.session.name);
    res.redirect("/hello");
    // res.send(name);
})

app.get("/hello", (req,res)=> {
//     res.locals.successmsg = req.flash("success");
//     res.locals.errormsg = req.flash("error");
    res.render("page.ejs", {name: req.session.name});
});

app.get("/recount",(req,res) => {
    if(req.session.count){
        req.session.count++;
    } else {
        req.session.count = 1;
    }
    res.send(`you sent a request ${req.session.count} times`);
})

// app.get("/test",(req,res)=> {
//     res.send("test successful!!");
// });


app.listen(3000, () => {
    console.log("server on 3000");
});