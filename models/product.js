const mongoose=require("mongoose")
const Reviews=require("./reviews")
const productSchema=new mongoose.Schema({
    name:{
        type:String
    },
    //Este apartado es para colocar el enlace de una imagen 
    img:{
        type:String
    },
    //Este apartado es para agregar una imagen desde tu equipo
    image:{
        data :Buffer,
        contentType:String
    },
    //Este apartado es para colocar el precio del producto 
    price:{
        type:Number,
        min:0,
        required:true
    },
    // Este apartado es para la descripcion 
    desc:{
        type:String
    },
    reviews:[
        {
            type:mongoose.ObjectId,
            ref:"reviews"
        },
    ],
    color: {
        type: String,
        require: true
    },
     Talla: {
         type: String,
         require: true
     },
    // edicion: {
    //     type: String,
    //     require: true
    // },
    // publicacion: {
    //     type: String, 
    //     require: true
    // },
    // paginas: {
    //     type: String,
    //     require: true
    // },
    // isbn: {
    //     type: Number,
    //     require: true
    // },
    // idioma:{
    //     type: String,
    //     require: true
    // },
    //Este apartado es para seleccionar una categoria
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