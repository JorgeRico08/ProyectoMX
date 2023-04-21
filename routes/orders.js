const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Product = require("../models/product");
const Users = require("../models/user");
const isLoggedIn = require("../middlewares/isLoggedIn");
const urlStoring = require("../middlewares/previousUrl");
const Razorpay = require("razorpay");
const { v4: uuid } = require("uuid");
const crypto = require("crypto");
const Orders = require("../models/order");
const currentUrl=require("../middlewares/currentUrl")
require('dotenv').config();

const instance = new Razorpay({
  key_id: process.env.RZP_key_id,
  key_secret: process.env.RZP_key_secret
});
router.post("/user/order",isLoggedIn, (req, res) => {
  try{
  let reciept = "ODRCPT_ID_" + uuid().slice(-12, -1);
  const data = req.body;
  data.receipt = reciept;
  instance.orders
    .create(data)
    .then((order) => {
      order.rzp_key=process.env.RZP_key_id
      res.send(order);
    })
    .catch((err) => {
      req.flash('error', "Se ha producido un problema en la red, inténtelo de nuevo.");
      res.send({"failure":"Este pago no puede efectuarse "})
    });
  }
  catch(e){
    console.log(e);
    res.status(404).render('error/error',{"status":"404"})
  }
});
// router.post("/user/order/verify", isLoggedIn,async (req, res) => {
//   console.log("Order Verify")
//   try{

//     body = req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;

//   const expectedSignature = crypto
//     .createHmac("sha256", process.env.RZP_key_secret)
//     .update(body.toString())
//     .digest("hex");

//   var response = { status: "failure" };
//   if (expectedSignature === req.body.razorpay_signature) {
//     try {

//       const code = Math.floor(100000 + Math.random() * 900000000).toString();

//       const userObj = await Users.findById(req.user._id);
//       const data = {
//         user: req.user,
//         orderid: code,
//         orderList: userObj.cart,
//         tarjeta: req.body.tarjeta,
//         cve: req.body.cve,
//         nombreFac: req.body.nombreFac,
//         colonia: req.body.colonia,
//         calle: req.body.calle,
//         cp: req.body.cp,
//         ciudad: req.body.ciudad,
//         estado: req.body.estado,
//         ref1: req.body.ref1,
//         telefono: req.body.telefono,
//         finalPrice: req.body.finalPrice,
//       };
      
//       const orderObj = new Orders(data);
//       userObj.orders.push(orderObj);
//       await orderObj.save();
//       userObj.cart.splice(0,userObj.orders.length)
//       await userObj.save();
//       req.flash("success","Su pedido se ha realizado correctamente");
//     } catch (e) {
//       console.log("There is a problem with orders");
//       console.log(e);
      
//     }
//   }
//   res.send(response);
//   }
//   catch(e){
//     console.log(e);
//     res.status(404).render('error/error',{"status":"404"});
//   }
// });

router.post('/pedido', isLoggedIn, async (req, res) => {
    try {
      const code = Math.floor(100000 + Math.random() * 900000000).toString();
      const userObj = await Users.findById(req.user._id);
      const data = {
        user: req.user,
        orderid: code,
        orderList: userObj.cart,
        tarjeta: req.body.tarjeta,
        cve: req.body.cve,
        nombreFac: req.body.nombreFac,
        colonia: req.body.colonia,
        calle: req.body.calle,
        cp: req.body.cp,
        ciudad: req.body.ciudad,
        estado: req.body.estado,
        ref1: req.body.ref1,
        telefono: req.body.telefono,
        finalPrice: req.body.finalPrice,
      };
      const orderObj = new Orders(data); 
      await orderObj.save();
      console.log(orderObj)
      userObj.orders.push(orderObj);
      userObj.cart.splice(0)
      await userObj.save();
      req.flash("success","Su pedido se ha realizado correctamente");
      res.redirect("/user/cart")
    } catch (err) {
      console.log("Problema con las ordenes");
      console.log(err)
      res.status(404).render('error/error',{"status":"404"});
    }
});

router.get("/user/payment/:payment_id/:error_code",isLoggedIn,(req,res)=>{
  try{
  const error=req.session.paymentError
  res.render("user/paymentError",{error});
  }
  catch(e){
    console.log(e);
    res.status(404).render('error/error',{"status":"404"});
  }
})
router.post("/user/order/paymentfail",isLoggedIn,(req,res)=>{
  try{
  req.session.paymentError=req.body.error;
  res.send({"redirect":`/user/payment/${req.body.error.payment_id}/${req.body.error.payment_id}`})
  }
  catch(e){
    console.log(e);
    res.status(404).render('error/error',{"status":"404"})
  }
})
module.exports = router;
