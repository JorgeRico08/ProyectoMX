const mongoose= require("mongoose");
const categoriaSchema=new mongoose.Schema({
    categorias:{
        type:String,
        required:true,
        unique: true
    }
})
//create a reviews database.
const Categorias= new mongoose.model("categorias",categoriaSchema);
module.exports=Categorias; 