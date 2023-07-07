const previousUrl=(req,res,next)=>{
  
    req.session.previousUrl=req.headers.referer; 
    next();   
}
module.exports=previousUrl;