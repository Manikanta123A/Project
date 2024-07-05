const User = require("../models/user")
const asyncwrap = function(fn){
    return function(req,res,next){
        fn(req,res,next).catch((err)=>{next(err)})
    }
}
module.exports.login = async(req,res)=>{
    req.flash("sucess","login sucessful")
    if(res.locals.Url){
        res.redirect(res.locals.Url)
    }else{
    res.redirect("/listings")
    }
}
module.exports.logout = async(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err)
        }
        else{
            req.flash("sucess", "successfully logged out")
            res.redirect("/listings")
        }
    })
}
module.exports.signup = async(req,res,next)=>{
    try{
    let {email, username , password} = req.body
    const newUser = new User({email,username})
    let registeredUser = await User.register(newUser, password)
    req.flash("sucess", "Sucessfully registered")
    res.redirect("/login")
    }
    catch(err){
        req.flash("error",err.message)
        res.redirect("/signup")
        next(err)
    }
}