const isLoggedIn=(req,res,next)=>{
    
        if(!req.isAuthenticated()){
            req.flash('error','Necesitas estar registrado para continuar')

            res.redirect("/login")
            
        }
        else
        next();
}
module.exports=isLoggedIn;