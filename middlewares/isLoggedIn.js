const isLoggedIn=(req,res,next)=>{
    
        if(!req.isAuthenticated()){
            req.flash('error','Necesitas estar registrado para continuar')
            // if(req.session){
            //     req.session.requestedUrl=req.headers.referer;
            // }
            res.redirect("/login")
            
        }
        else
        next();
}
module.exports=isLoggedIn;