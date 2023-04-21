const mongoose = require("mongoose");
const orderSchema = mongoose.Schema({
  user: {
    type: mongoose.ObjectId,
    ref: "users",
  },
  orderid: {
    type: String,
  },
  orderList: [
    {
      type: Object,
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
  },
});


const Orders = new mongoose.model("orders", orderSchema);
module.exports = Orders;
