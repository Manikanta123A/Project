const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const Review= require("../models/review")
const User = require("../models/user")
const listingSchema= new Schema({
    title:{
        type:String,
        required:true
    },
    description:String,
    image:{
        url : String,
        filename : String
        
    },
    price:Number,
    location:String,
    country:String,
    reviews:[ {
        type: Schema.Types.ObjectId,
        ref : "Review"
    }],
    owner :{
        type: Schema.Types.ObjectId,
        ref : "User"
    },
    geometry:{
        type : {
            type: String,
            enum : ['Point'],
            required : true
        },
        coordinates : {
            type : [Number],
            required : true
        }
    },
    category: {
        type : String,
        enum:["rooms","iconiccities","mountains","castles","amazingpool","camping","Farms","artics"],
        default:"rooms"
    }
})

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
    let result = await Review.deleteMany({_id : {$in : listing.reviews}})
    }
})

const Listing =  mongoose.model("Listing",listingSchema)

module.exports=Listing