const mongoose=require("mongoose")

const dataschema=mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    info:String,
    name:String
});

module.exports=mongoose.model('Trial',dataschema);