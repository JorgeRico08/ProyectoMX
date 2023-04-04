const nodemailer = require('nodemailer');
const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const previousUrl = require("../middlewares/previousUrl");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const currentUrl = require("../middlewares/currentUrl");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname,"/uploads/users"));
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString().replace(/:/g, '-')+ file.originalname);
  },
});

const upload = multer({ storage: storage });


//Correo 
var transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
  user: 'lalo456rangel@gmail.com',
  pass: 'xzob hbwp umqw viss'
  }
});

router.get("/register", async (req, res) => {
  try {
    res.render("authentication/register");
  } catch (e) {
    console.log(e);
    res.status(404).render("error/error", { status: "404" });
  }
});
router.post("/register", upload.single("image"), async (req, res) => {
  try {

    /* 
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    
    */

    const userObj = new User({
      username: req.body.username,
      email: req.body.email,
      role: req.body.role,
      //code
    });
    let file;
    try {
      file = path.join(__dirname,"/uploads/users/" + req.file.filename);
      userObj.image = {
        data:  fs.readFileSync(file),
        contentType: "image/png",
      };
      
    } catch (e) {
      userObj.image = null;
    }


    var mailOptions = {
      from: 'lalo456rangel@gmail.com',
      to: userObj.email,
      subject: `Documento Aceptado`,
      text: "PRUEBA EMAIL",
      html: `
      <h1>Bienvenido a librito MX - Tu libreria de preferencia</h1>
      <h2>Te damos la bienvenida: ${userObj.username}</h2>
      <img src="https://familiasactivas.com/wp-content/uploads/2018/04/rafaelalberti.jpg" alt="Imagen de librito mx">
      <br>
      <br>
      <a href="http://localhost:3000/" >Acitiva tu cuenta con un solo boton</a>`
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email enviado: ' + info.response);
      }
    });

    await User.register(userObj, req.body.password);

    req.flash("login", "User Registered Successfully, Login to Continue");
    res.redirect("/login");
  } catch (err) {
    req.flash("register", err.message);
    res.redirect("/register");
  }
});

router.get(
  "/login",
  (req, res, next) => {
    try {
      if (req.isAuthenticated()) {
        req.flash("error", "Your are already Logged In");
        let redirect = "/";

        
        res.redirect(redirect);
      } else next();
    } catch (e) {
      console.log(e);
      res.status(404).render("error/error", { status: "404" });
    }
  },
  async (req, res) => {
    try {
      res.render("authentication/login");
    } catch (e) {
      res.status(404).render("error/error", { status: "404" });
    }
  }
);
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    try {
      // if (req.user.username ) {
        
      // } else {
        req.flash("login", `Welcome Back "${req.user.username}" `);
        // req.session.requestedUrl ||
        let redirect = req.session.previousUrl || "/"; 
        res.redirect(redirect);
      // }
    } catch (e) {
      console.log(e);
      res.status(404).render("error/error", { status: "404" });
    }
  }
);
router.get("/logout", function (req, res) {
  try {
    req.flash("login", "User Logged Out");
    req.logout();
    let redirect = req.session.previousUrl || "/";
    res.redirect(redirect);
  } catch (e) {
    console.log(e);
    res.status(404).render("error/error", { status: "404" });
  }
});

//Google Authentication Routes
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  function (req, res) {
    try {
      // Successful authentication, redirect home.
      // let redirect=req.session.requestedUrl || req.session.previousUrl|| '/';
      console.log("Entered into google authentication");
      let redirect = req.session.previousUrl || "/";
      res.redirect(redirect);
    } catch (e) {
      console.log(e);
      res.status(404).render("error/error", { status: "404" });
    }
  }
);
module.exports = router;
