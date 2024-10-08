const express = require("express");
const router = express.Router();


//Index - users
router.get("/",(req,res)=> {
    res.send("get for users");
});

//show
router.get("/:id", (req,res)=> {
    res.send("get for show");
})

//post
router.post("/:id", (req,res)=> {
    res.send("get for post");
})

//delete
router.delete("/:id", (req,res)=> {
    res.send("get for delete");
})

module.exports = router;