const express = require("express");
const app = express();
const users = require("./route/user.js")
const posts = require("./route/post.js");
const session = require("express-session")
const flash = require("connect-flash")
const path = require("path");
// const cookieParser = require("cookie-parser");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

const Sessionoptions = {
    secret : "mysupersecretstring" ,
    resave: false ,
    saveUninitialized: false  
}


// app.use(cookieParser("secretcode"));

// app.get("/getsignedcookie",(req,res) => {
//     res.cookie("made-in" , "India" , {signed : true})
//     res.send("signed cookie send");
//     res.send(req.signedCookies);
// })

// app.get("/verify",(req,res) => {
//     console.log(req.signedCookies);
//     res.send("verified")
// })

// app.get("/greet",(req,res) => { 
//     let {name = "Anoyoomous"} = req.cookies ;
//     res.send(`Hii ${name}!`);
// })

// app.get("/getcookies",(req,res) => {
//     res.cookie("greet" , "Namaste" ) ;
//     res.cookie("MadeIn" , "India" ) ;
//     res.send("Send some cookies");
// })



// app.get("/",(req,res) => {
//     console.dir(req.cookies);
//     res.send("hii i am root");
// })

// app.use("/users",users);

// app.use("/posts",posts);


app.use(session(Sessionoptions))
app.use(flash());
app.use((req,res,next) =>{
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    next();
})


app.get("/Register", (req, res) => {
    let { name = "Anonymous" } = req.query;
    req.session.name = name;
    if(name == "Anonymous" ){
        req.flash("error", " User not registered ");
    }else{
        req.flash("success", "User registered successfully");
    }
    res.redirect("/hello");
});



app.get("/hello", (req, res) => {
    
    res.render("page.ejs", { name: req.session.name  });
});



// app.get("/reqcount" ,(req,res) => {
//     if(req.session.count){
//         req.session.count++ ;
//     }else{
//         req.session.count = 1
//     }
    
//     res.send(`you send a request ${req.session.count} times`)
// })


app.listen(3000,() => {
    console.log("Server is running on port 3000");
});