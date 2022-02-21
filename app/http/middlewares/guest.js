function guest(req, res, next){
    if(!req.isAuthenticated()){  //if logged in , then redirect user to home page
        return next()
    }
    return res.redirect('/')
}
module.exports =guest