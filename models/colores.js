const mongoose= require("mongoose");
const colorSchema=new mongoose.Schema({
    colores:{
        type:String,
        required:true,
        unique: true
    }
})
//create a reviews database.
const Colores= new mongoose.model("colores",colorSchema);
module.exports=Colores; 