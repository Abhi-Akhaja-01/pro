const express =require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListings} = require("../middleware.js");

const listingController = require("../controllers/listings.js");

const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage})

// use router.route method : same path add one frame

router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
        isLoggedIn, 
        upload.single("listing[image]"),
        validateListings,
        wrapAsync(listingController.createListing)
      );

  
// New Route
router.get("/new",isLoggedIn, wrapAsync(listingController.new));

router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(validateListings,
      isLoggedIn,
      isOwner,        
      upload.single("listing[image]"),
      wrapAsync(listingController.updateListing))
  .delete(isLoggedIn, wrapAsync(listingController.destroyListing));

//edit Route
router.get("/:id/edit",
  isLoggedIn,
  isOwner, 
  wrapAsync(listingController.renderEditFrom));


// //Index Route
// router.get("/", wrapAsync(listingController.index));

// // New Route
// router.get("/new",isLoggedIn, wrapAsync(listingController.new));

// // Show Route
// router.get("/:id",  wrapAsync(listingController.showListing));

// // Create Route
// router.post("/",validateListings,isLoggedIn, wrapAsync(listingController.createListing));




//    // let {title, description, image, price, country, location} = req.body;

//      // let listing = req.body.listing;
//    // console.log(listing);

//     // if(!req.body.listing) {
//     //     throw new ExpressError(400, "send valid data for listing");
//     // }
//     // if(!newListing.title) {
//     //     throw new ExpressError(400,"Title is missing!");
//     // }
//     // if(!newListing.description) {
//     //     throw new ExpressError(400,"description is missing!");
//     // }
//     // if(!newListing.location) {
//     //     throw new ExpressError(400,"location is missing!");
//     // }

  

// // Edit Route
// router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.renderEditFrom));

// // Update Route
// router.put("/:id",validateListings,isLoggedIn,isOwner, wrapAsync(listingController.updateListing));

// // Delete Route
// router.delete("/:id",isLoggedIn, wrapAsync(listingController.destroyListing));

module.exports = router;






