const nodemailer = require('nodemailer');
const Recaptcha = require('google-recaptcha');
const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const previousUrl = require("../middlewares/previousUrl");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const isLoggedIn=require("../middlewares/isLoggedIn")
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

const recaptcha = new Recaptcha({ secret: '6LcLr5slAAAAAMi5S06BGPrd9Rv7W' });


const validarActivo= async(req,res,next)=>{
  const {id} = req.params;
  await User.find(id, {verificado: false}, (error, result)=> {
    if (req.user.verificado == false) {
      req.logout();
    }
  })
}

//Correo 
var transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
  user: 'libritomxdev12@gmail.com',
  pass: 'lbnd imoc giwl lybx'
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
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    let oData = req.body

    const userObj = new User({
      username: req.body.username,
      email: req.body.email,
      telefono: req.body.telefono,
      codeNuevo: code
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

            // ********   VALIDACION reCAPCHA
            const recaptchaToken = oData['g-recaptcha-response'];
            let secret = "6LefrZwlAAAAAHcdRiK3lzMKfNBcD5l5Vckulx_i ";
    
            const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${recaptchaToken}`;
            const response = await fetch(url, {
              method: 'POST'
            });
            const data = await response.json();
    
            // ************
    

    const mailOptions = {
      from: 'libritomxdev@gmail.com',
      to: userObj.email,
      subject: `Welcome LibritoMX`,
      text: "Tienda numero 1 en venta de libros",
      html: `
      <h1>Bienvenido a librito MX - Tu libreria de preferencia</h1>
      <h2>Te damos la bienvenida: ${userObj.username}</h2>
      <p>Tu codigo de inicio de sesion es: ${userObj.codeNuevo}</p>
      <p>Este codigo es importante para poder iniciar sesion por primera vez en la aplicacion</p>
      <img src="https://familiasactivas.com/wp-content/uploads/2018/04/rafaelalberti.jpg" alt="Imagen de librito mx">`
    };

    var myregex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/; 
    // if (!myregex.test(req.body.password && req.body.pwd2)) {
      if (req.body.password == req.body.pwd2) {
        if (!data.success) {
          req.flash("register", "reCAPTCHA invalido, Acaso no eres un humano!");
          res.redirect("/register");
        }else{
          const enviarEmail = transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email enviado: ' + info.response);
            }
          });
  
          User.register(userObj, req.body.password);
          enviarEmail;
          req.flash("login", "Usuario registrado correctamente, inicie sesión para continuar");
          req.flash("login", "Se enviado un email con su codigo de acceso para acceder!");
          res.redirect("/login");
        }
  
      // } else {
      //   req.flash("register", "Las contraceñas no coinciden");
      //    res.redirect("/register");
      // }
    } else {
      req.flash("register", "La contraceña debe cumplicir con las espesificaciones mensionadas");
      res.redirect("/register");
    }

    

  } catch (err) {
    req.flash("register", "El correo o usuario estan duplicado porfavor elija otro");
    res.redirect("/register");
  }
});

router.get(
  "/login",
  (req, res, next) => {
    try {
      if (req.isAuthenticated()) {
        req.flash("error", "Ya está conectado");
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

router.get("/verificar",previousUrl, isLoggedIn, async (req, res) => {
  try {
    const { id } = req.params;
    const data = await User.findById(id);
    res.render("authentication/verificar", {data});
  } catch (err) { 
    console.log(err);
    res.status(404).render("error/error", { status: "404" });
  }
});

router.patch("/verificar/:id", async (req, res) => { //codeNuevo
  try {
    const { id } = req.params;
    const data = req.body.codeNuevo;

    if (data == req.user.codeNuevo) {
      await User.findByIdAndUpdate(id, {verificado: true});
      res.redirect("/");
    } else {
      console.log("Error")
      req.flash("error", "Codigo de verificacion incorrecto");
      res.redirect("/salir")
    }
  } catch (err) {
    console.log(err);
    res.status(404).render("error/error", { status: "404" });
  }
});

router.get("/salir", function (req, res) {
  try {
    req.flash("login", "Usuario desconectado");
    req.logout();
    res.redirect("/login");
  } catch (e) {
    console.log(e);
    res.status(404).render("error/error", { status: "404" });
  }
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    try {
      if (req.user.verificado == false) {
        req.flash("error", `Cuenta no verificada es nesesario que se valide la cuenta`);
        res.redirect('/verificar')

      } else {
        req.flash("login", `Bienvenido de nuevo "${req.user.username}" `);
        // req.session.requestedUrl ||
        let redirect = req.session.previousUrl || "/"; 
        res.redirect(redirect);
      }
    } catch (e) {
      console.log(e);
      res.status(404).render("error/error", { status: "404" });
    }
  }
);
router.get("/logout", function (req, res) {
  try {
    req.flash("login", "Usuario desconectado");
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
      console.log("Introducido en la autenticación de google");
      let redirect = req.session.previousUrl || "/";
      res.redirect(redirect);
    } catch (e) {
      console.log(e);
      res.status(404).render("error/error", { status: "404" });
    }
  }
);


router.get("/rPass", async (req, res) => {
  try {
    res.render("authentication/rContraceña");
  } catch (e) {
    console.log(e);
    res.status(404).render("error/error", { status: "404" });
  }
});

router.get("/rContraceñas/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await User.findById(id);
    res.render("authentication/Shared/idUsuarioRC", {data});
  } catch (err) { 
    console.log(err);
    res.status(404).render("error/error", { status: "404" });
  }
});

router.post("/rContraceña", async (req, res) => {
  try {
    const Email = req.body.email;
    await User.findById({email: Email})


  } catch (err) { 
    console.log(err);
    res.flash("error", "Correo invalido");;
  }
});


module.exports = router;
