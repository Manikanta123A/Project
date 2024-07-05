const Listing = require("./models/listing")
const Review = require("./models/review.js")
module.exports.isloggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.url = req.originalUrl
        req.flash("error","you need to login")
        res.redirect("/login")
    }
    else{
       
        next()
    }
}
module.exports.savepath=(req,res,next)=>{
    req.session.path = req.originalUrl
    next()
}
module.exports.saveUrl = (req,res,next)=>{
    if(req.session.url){
        res.locals.Url = req.session.url
        res.locals.path= req.session.path
    }
    next()
}

module.exports.isOwner = async(req,res,next)=>{
    let {id}= req.params
    let listing = await Listing.findById(id)
    if (res.locals.currUser && res.locals.currUser._id.equals(listing.owner._id)){
        next()
    }
    else{
        req.flash("error","you are not the owner of this listing")
        res.redirect(`/listings/${id}`)
    }
}
module.exports.isCreated = async(req,res,next)=>{
    let{reviewId,id}= req.params
    let review = await Review.findById(reviewId)
    if (res.locals.currUser && res.locals.currUser._id.equals(review.owner._id)){
        next()
    }
    else{
        req.flash("you didnt create that Review")
        res.redirect(`/listings/${id}`)
    }
}