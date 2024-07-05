require("dotenv").config();
//npm modules 
const express = require("express")
const path=require("path")
const methodOverride= require("method-override")
const ejsMate = require("ejs-mate")
const session = require("express-session")
const mongostore = require("connect-mongo")
const flash = require("connect-flash")
const passport = require("passport")
const localstrategy = require("passport-local")
//express 
const app=express()
app.engine("ejs",ejsMate)
app.set("view engine","ejs")
app.set("views",path.join(__dirname,"/views"))
app.use(express.static("public"))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"))
//error handling
const MyError= require("./utils/error.js")
//user listings
const User = require("./models/user.js")
//express routers
const userrouter = require("./routes/user.js")
const listingsrouter = require("./routes/listings.js")
const reviewsrouter = require("./routes/review.js")
//mongoose connections
const mongoose= require("mongoose")
let dbUrl = process.env.DB_URL
let mongourl = "mongodb://127.0.0.1:27017/listin"
async function main(){
    await mongoose.connect(dbUrl)
}
main().
then(()=>{
    console.log("connected to B")
})
.catch((err)=>{
    console.log(err)
})

// port 
let port = 3000
app.listen(port,()=>{
    console.log("listening")
})

const store = mongostore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.secret
    },
    touchAfter: 24*3600
})
const secret = {
    store,
    secret :process.env.secret,
    resave: false,
    saveuninstallized : true,
    cookie:{
        expires : Date.now()+7*24*60*60*100,
        maxage : 7*24*60*60*100,
        httpOnly:true
    }
}

app.use(session(secret))
app.use(flash())


app.use(passport.initialize())
app.use(passport.session())
passport.use(new localstrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


app.use((req,res,next)=>{
    res.locals.message = req.flash("sucess")
    res.locals.error = req.flash("error")
    res.locals.currUser = req.user;
    next()
})
//lsiting
app.use("/listings", listingsrouter)
// review 
app.use("/listing/:id/reviews",reviewsrouter)
// user
app.use("/", userrouter)
//middle ware
app.all("*",(req,res,next)=>{
    throw new MyError(404,"page not found")
})
//error middle ware
app.use((err,req,res,next)=>{
    let {status=500,message="soemthing is wrong"} = err;
    res.status(status).render("error.ejs",{message})
})
