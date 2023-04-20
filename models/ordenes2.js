const mongoose = require("mongoose");
const ordenesSchema = mongoose.Schema({
  user: {
    type: mongoose.ObjectId,
    ref: "users",
  },
  orderid: {
    type: String,
    required: true,
  },
  orderList: [
    {
      type: Object,
      required: true,
    },
  ],
  fechaCompra: {
    type: Date,
    default: Date.now(),
  },
  tarjeta: {
    type: String,
  },
  cve:{
    type:Number
  },
  nombreFac: {
    type:String
  },
  colonia: {
    type: String,
  },
  calle: {
    type: String
  },
  cp:{
    type: Number
  },
  ciudad:{
    type: String
  },
  estado: {
    type: String
  },
  ref1:{
    type: String
  },
  telefono:{
    type: Number
  },
  finalPrice: {
    type: Number,
    required: true,
  },
});
const Ordenes = new mongoose.model("ordenes", ordenesSchema);
module.exports = Ordenes;
