const Listing = require("../models/listing.js")
const fetch = require('node-fetch');


// const Listing = require("../models/listing");

module.exports.index = async(req,res) => {
    const allListings =  await Listing.find({});
    res.render("Listing/index.ejs",{allListings});
    
};

module.exports.renderNewform = (req,res) => {
    res.render("Listing/new.ejs");
};

module.exports.showListing =  async (req,res) => {
    let {id} = req.params ;
   const listing = await  Listing.findById(id).populate({path : "reviews", populate : {path : "author"}}).populate("owner");
   if(!listing){
    req.flash("error","listing does not exist");
    res.redirect("/Listings")
   }
   console.log(listing);
   res.render("Listing/show.ejs",{listing});
}


module.exports.createListing = async (req, res, next) => {
    try {
        console.log("Create Listing Controller Triggered");

        // Log the request body and file
        console.log("Request Body:", req.body);
        console.log("Uploaded File:", req.file);

        const { listing } = req.body;

        if (!req.file) {
            console.error("File upload failed: No file provided.");
            throw new Error("File upload is required.");
        }

        // Fetch location coordinates using OpenCage Geocoding API
        const location = listing.location;
        const apiKey = '7e9d2709356a488198093e474522a9a2'; // Replace with your OpenCage API key

        const geocodeResponse = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(location)}&key=${apiKey}`);
        if (!geocodeResponse.ok) {
            console.error('Geocoding API error:', geocodeResponse.status, geocodeResponse.statusText);
            throw new Error('Failed to fetch geocoding data');
        }
        const geocodeData = await geocodeResponse.json();
        console.log('Geocoding Data:', JSON.stringify(geocodeData, null, 2));

        if (geocodeData.results.length === 0) {
            req.flash("error", "Location not found");
            return res.redirect("/Listings/new");
        }

        const { lat, lng } = geocodeData.results[0].geometry;

        // Create the new listing with the fetched latitude and longitude
        const newListing = new Listing({
            ...listing,
            geometry: {
                type: "Point",
                coordinates: [lng, lat], // GeoJSON expects [longitude, latitude]
            },
            owner: req.user._id,
            image: {
                url: req.file.path,
                filename: req.file.filename,
            },
        });

        console.log("New Listing Object:", newListing);

        // Save to the database
        await newListing.save();
        console.log("Listing saved to database");

        req.flash("success", "New listing created");
        res.redirect("/Listings");
    } catch (err) {
        console.error("Error in createListing:", err);
        next(err); // Pass the error to error-handling middleware
    }
};



module.exports.renderEditform = async(req,res) => {
    let {id} = req.params ;
   const listing = await  Listing.findById(id); 

   if(!listing){
    req.flash("error","listing does not exist");
    res.redirect("/Listings")
   }

   let originalUrl = listing.image.url ;
   originalUrl = originalUrl.replace("/upload","/upload/w_250");
   res.render("Listing/edit.ejs",{listing,originalUrl});
};

module.exports.UpdateListing = async (req,res) => {
    let {id} = req.params ;
    let listing = await Listing.findByIdAndUpdate(id ,{...req.body.listing});

    if(typeof req.file !== "undefined"){
        let url = req.file.path ;
        let filename = req.file.filename ;
        listing.image = { url ,filename };
        await listing.save();
    };

    req.flash("success","listing Updated!");
    res.redirect(`/Listings/${id}`)
}

module.exports.DestroyListing = async (req,res) => {
    let {id} = req.params ;
    let deletedlisting = await Listing.findByIdAndDelete(id);
    req.flash("success","listing deleted Sucessfully"); 
    console.log(deletedlisting);
    res.redirect("/Listings");
};
