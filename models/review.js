
const mongoose = require("mongoose")
const schema = mongoose.Schema
const review_schema = new schema ({
    comment : String,
    rating : {
        type: Number,
        min : 1,
        max : 5
    },
    createdAt:{
        type: Date,
        default: Date.now()
    },
    owner:{
        type: schema.Types.ObjectId,
        ref: "User"
    }

})

module.exports = mongoose.model("Review", review_schema)