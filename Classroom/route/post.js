const express = require("express");
const router = express.Router();


// POSTS
//Index -> posts
router.get("/" , (req,res) => {
    res.send("GET for posts");
})


//Show -> posts
router.get("/:id" , (req,res) => {
    res.send("GET for posts id");
})

//POST ->posts
router.get("/" , (req,res) => {
    res.send("POST for  posts");
})

//DELETE -> posts
router.delete("/:id" , (req,res) => {
    res.send("DELETE for posts id");
})

module.exports = router;