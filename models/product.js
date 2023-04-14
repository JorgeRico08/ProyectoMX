const mongoose=require("mongoose")
const Reviews=require("./reviews")
const productSchema=new mongoose.Schema({
    name:{
        type:String
    },
    img:{
        type:String
    },
    image:{
        data :Buffer,
        contentType:String
    },
    price:{
        type:Number,
        min:0,
        required:true
    },
    desc:{
        type:String
    },
    reviews:[
        {
            type:mongoose.ObjectId,
            ref:"reviews"
        },
    ],
    autor: {
        type: String,
        require: true
    },
    editorial: {
        type: String,
        require: true
    },
    edicion: {
        type: String,
        require: true
    },
    publicacion: {
        type: String, 
        require: true
    },
    paginas: {
        type: String,
        require: true
    },
    isbn: {
        type: Number,
        require: true
    },
    idioma:{
        type: String,
        require: true
    },
    categoria:{
        type: String,
        require: true
    },
    activo: {
        type: Boolean,
        require: true,
        default: true
    },
    created_at: {type: Date, default: Date.now()}

})
const Product=new mongoose.model("products",productSchema)
module.exports = Product;