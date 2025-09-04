const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path= require("path");
const User = require("./models/user.js");

app.set("views",path.join(__dirname,"views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({ extended : true}));



main()
.then( () =>{
 console.log("connection was successful");
})
.catch( (err) =>{
    console.log(err);
});

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/colordb");
}


app.get("/",(req,res) =>{
    res.render("resis.ejs");
});
app.post("/",(req,res) =>{
    let {phone,password,username} = req.body;
    
    let newUser = new User({
        phone: phone,
        password: password,
        username: username
    });
    newUser.save()
    .then( (res) =>{
        console.log(res);
    })
    .catch( (err) =>{
        console.log(err);
    });
    
    res.render("game.ejs",{username});
});

app.get("/login",(req,res) =>{
    res.render("login.ejs",{message:""});
});


app.post("/login", async (req,res) =>{
    let {phone,password, } = req.body;
     const user = await User.findOne({phone});
      const username= user.username;
      
      if(!user){
        return res.render("login.ejs",{message: "User not found"});
    }

    if(user.password !== password){
        return res.render("login.ejs",{message: "Wrong password!"});
    }
          res.render("game.ejs",{username});

});
 app.get("/30s",(req,res) =>{
     let username = req.body;
     console.log(username);
    res.render("game.ejs",{username});
 });
app.get("/one", async (req,res) =>{
    res.render("game1.ejs");
});
 app.get("/three", async (req,res) =>{
    res.render("game3.ejs");
});
app.get("/five", async (req,res) =>{
    res.render("game5.ejs");
});

app.listen(8080,() =>{
    console.log("app is listening on port 8080");
});