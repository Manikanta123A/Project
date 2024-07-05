const mongoose = require("mongoose")
async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/listin")
}

main().
then(()=>{
    console.log("connected to DB")
})
.catch((err)=>{
    console.log(err)
})
const sample=require("./data.js")
const Listing = require("../models/listing.js")

 const initDB= async ()=>{
    await Listing.deleteMany({})
    sample.data = sample.data.map((obj)=> ({...obj,owner:'6683aea6beab12bfba158bac'}))
    await Listing.insertMany(sample.data)
    console.log("Data was initialized")
  }
 initDB();