const mongoose= require("mongoose");
const tallaSchema=new mongoose.Schema({
    tallas:{
        type:String,
        required:true,
        unique: true
    }
})
//create a reviews database.
const Tallas= new mongoose.model("tallas",tallaSchema);
module.exports=Tallas; 