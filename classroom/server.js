const express = require("express");
const app = express();
const users = require("./routes/user.js");
const posts = require("./routes/post.js");
const cookieParser = require("cookie-parser");

app.use(cookieParser("secretcode"));

app.get("/getsigncookie", (req,res) => {
    res.cookie("made-in","India", {signed: true});
    res.send("signed cookie sent");
});

app.get("/getcookies", (req,res) => {
    res.cookie("greet","hello");
    res.cookie("name","abhi");
    res.send("send your some cookies!");
})

app.get("/verify", (req,res) => {
    console.log(req.signedCookies);
    res.send("verified!")
})

app.get("/greet",(req,res) => {
    let {name= "noname"} = req.cookies;
    res.send(`HII ${name}`);
})

app.get("/", (req,res) => {
    console.dir(req.cookies);
    res.send("hyy abhi");
});


app.use("/users",users);
app.use("/posts",posts);


app.listen(3000, () => {
    console.log("server on 3000");
});

