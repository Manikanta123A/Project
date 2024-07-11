const Listing = require("../models/listing.js")
const  express= require("express")
const router = express.Router()
const {isloggedIn,isOwner,saveUrl,savepath}= require("../middleware.js")
const listingcontroller = require("../controller/listings.js")
const multer = require("multer")
const {storage} = require("../cloudinary.js")
const uploads = multer({storage})


router.route("/")
.get(listingcontroller.index)
.post(isloggedIn,uploads.single("listing[image]"),listingcontroller.add)

//new route
router.get("/new",isloggedIn, listingcontroller.new)
//search 
router.get("/name",listingcontroller.searchByName)
//search by catgeory
router.get("/category/:categor", async(req,res)=>{
    let {categor} = req.params;
    let allistings = await Listing.find({category:categor});
    res.render("index.ejs",{allistings})
})
router.route("/:id")
.get(listingcontroller.show)
.patch(isOwner,isloggedIn, uploads.single("listing[image]"),listingcontroller.insert)
.delete(isOwner,isloggedIn,listingcontroller.delete)

//Edit  route
router.get("/:id/Edit",isOwner,isloggedIn,listingcontroller.edit)
module.exports = router