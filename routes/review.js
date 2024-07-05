const express= require("express")
const router = express.Router({mergeParams:true})
const { isloggedIn,isCreated } = require("../middleware.js")
const Reviewcontroller = require("../controller/review.js")


// review saving
router.post("/",isloggedIn,Reviewcontroller.add)
//Delete review route
router.delete("/:reviewId",isCreated,isloggedIn,Reviewcontroller.delete)
module.exports = router;