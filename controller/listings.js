const Listing = require("../models/listing")
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

const asyncwrap = function(fn){
    return function(req,res,next){
        fn(req,res,next).catch((err)=>{next(err)})
    }
}

module.exports.index = asyncwrap(async (req,res,next)=>{
    const allistings= await  Listing.find({})
    res.render("index.ejs",{allistings})
})
module.exports.show = asyncwrap(async (req,res,next)=>{
    let {id}=req.params
    let list = await Listing.findById(id).populate({path : "reviews",populate:{path : "owner"}}).populate("owner")
    if(!list){
        req.flash("error","The listing which you are trying to acess does not exsits")
        res.redirect("/listings")
    }
    else{
    res.render("show.ejs",{list})
    }
})
module.exports.add=asyncwrap(async (req,res,next)=>{
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
    .send()
    let url = req.file.path
    let filename = req.file.filename
    let listings = req.body.listing
    listings.owner = req.user._id
    listings.image = {url ,filename}
    listings.geometry = response.body.features[0].geometry
    await Listing.insertMany(listings)
   
    req.flash("sucess","successfully added")
    res.redirect('/listings')
})
module.exports.edit =asyncwrap(async (req,res)=>{
    let {id}=req.params
    let list = await Listing.findById(id)
    let originalUrl = list.image.url
    originalUrl =originalUrl.replace("/upload","/upload/h_300,w_250")
    if(!list){
        req.flash("error","listing does not exist")
        res.render("/listings")
    }
    else{
    res.render("Edit.ejs",{list,originalUrl})
    }
    })
module.exports.new= (req,res)=>{
    res.render("new.ejs")
}
module.exports.insert = asyncwrap(async(req,res,next)=>{
    let {id} = req.params
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
    .send()
    let result = await Listing.findByIdAndUpdate(id,{...req.body.listing, geometry:response.body.features[0].geometry})
    if(typeof req.file !== 'undefined'){
         let url = req.file.path
         let filename = req.file.filename
         result.image = {url, filename}
         await result.save()
    }
    req.flash("sucess","sucessfully edited")
    res.redirect(`/listings/${id}`)
})
module.exports.delete = asyncwrap(async(req,res,next)=>{
    let {id}= req.params
    await Listing.findByIdAndDelete(id)
    req.flash("sucess","sucessfully deleted")
    res.redirect("/listings")
    })
module.exports.searchByName = async(req,res)=>{
    let {Name} =req.query
    let url = res.locals.path
    let listing = await Listing.find({title : Name})
    if(listing.length > 0){
        res.redirect(`/listings/${listing[0]._id}`)
    }
    else{
        req.flash("error","That list doesnt not exist")
        res.redirect(url)
    }
}