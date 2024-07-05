const express= require("express")
const router = express.Router()
const passport = require("passport")
const {saveUrl}= require("../middleware.js")
const Listing =require("../models/listing")
const usercontroller = require("../controller/users.js")
router.get("/",(async (req,res,next)=>{
    const allistings= await  Listing.find({})
    res.render("index.ejs",{allistings})
})
//signup
router.route("/signup")
.get(async(req,res)=>{
    res.render("users/signup.ejs")
})
.post(usercontroller.signup)

//login form
router.route("/login")
.get(async(req,res)=>{
    res.render("users/login.ejs")
})
.post(saveUrl,passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
}),usercontroller.login)

//logout
router.get("/logout", usercontroller.logout)
module.exports = router
