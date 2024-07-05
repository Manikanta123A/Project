const MyError= require("../utils/error.js")
const Listing = require("../models/listing.js")
const Review = require("../models/review.js")
const {reviewschema} = require("../schema.js")
const asyncwrap = function(fn){
    return function(req,res,next){
        fn(req,res,next).catch((err)=>{next(err)})
    }
}
module.exports.add = asyncwrap(async (req,res,next)=>{
    let {error} = reviewschema.validate(req.body)
    if (error){
        throw new MyError(404, error)
    }
    else {
    let listing = await Listing.findById(req.params.id)
    let newreview = new Review(req.body.review)
    newreview.owner = req.user._id
    listing.reviews.push(newreview)
    await newreview.save()
    await listing.save()
    req.flash("sucess", "review added")
    res.redirect(`/listings/${listing._id}`)}
})

module.exports.delete= async(req,res)=>{
    let {id,reviewId} = req.params
    let result = await Listing.findByIdAndUpdate(id, {$pull : {reviews : reviewId}})
    let result2 = await Review.findByIdAndDelete(reviewId)
    req.flash("sucess", "reviews deleted sucess")
    res.redirect(`/listings/${id}`)
 }