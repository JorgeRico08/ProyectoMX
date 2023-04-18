const isAdmin=(req,res,next)=>{
if( req.user.role!=="Admin"){
    req.flash("error","Necesita ser Admin para continuar..")
    console.log("\n\n\n\n\ Esta es la url de Admin \n\n\n\n")
    console.log(req.session.previousUrl)
    res.redirect(req.session.previousUrl)
}
else{
    next();
}
}
module.exports=isAdmin;