const express = require('express');
const router = express.Router();
const mongoose=require("mongoose")

//importing from models
const trialdata=require("../models/basicmodel")

router.get("/",(req,res,next) =>{
    res.status(200).json({
        message:"handled get"
    });
});
router.post("/",(req,res,next) =>{

    const trial = trialdata({
        _id:new mongoose.Types.ObjectId(),
        inform:req.body.info,
        name:req.body.name
    });
    trial.save();
    res.status(200).json({
        message:"handled post",
        final:trial

    });
});

router.post("/:proid",(req,res,next) =>{
    var id =req.params.proid;
    res.status(200).json({
        message:id
    });
});


module.exports=router;