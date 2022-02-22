// so that only admin users can have access to the admin page



function admin (req, res, next){
    if(req.isAuthenticated() && req.user.role == 'admin'){
        return next()
    }
    return res.redirect('/')
}
module.exports = admin