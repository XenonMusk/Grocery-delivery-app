const User =require('../../models/user')
const bcrypt = require('bcrypt')
const passport = require('passport')
function authController(){
    const _getRedirectUrl = (req) => {
        return req.user.role === 'admin' ? '/admin/orders' : '/customer/orders'// to check the role
    }
    
    
    return {
        login(req,res){
         res.render('auth/login')
        },
        postLogin(req, res, next){


            const { name, email, password}=req.body
            //Validate Request
            if( !email || !password){
                req.flash('error', 'ALL FIELDS ARE REQUIRED !!')
                return res.redirect('/login')
            }

          passport.authenticate('local',(err, user, info) =>{
            if(err){
                req.flash('error',info.message)
                return next(err)
            }
            if(!user){
                req.flash('error', info.message)
                return res.redirect('/login')
            }
            req.logIn(user, (err)=>{
                if(err){
                    req.flash('error',info.message)
                    return next(err)
                }
                return res.redirect(_getRedirectUrl(req))
            })
          })  (req, res,next)
        },
        register(req,res){
         res.render('auth/register')
        },
       async postRegister(req,res){
            const { name, email, password}=req.body
            //Validate Request
            if(!name || !email || !password){
                req.flash('error', 'ALL FIELDS ARE REQUIRED !!')
                req.flash('name',name)
                req.flash('email',email)
                return res.redirect('/register')
            }
            //Checking email existing in database
            User.exists({email:email}, (err,result)=>{
                if(result){
                req.flash('error', 'This email is already registered!')
                req.flash('name',name)
                req.flash('email',email)
                return res.redirect('/register') //if we will not send this request, then the page will keep on loading and not fetch anything
                }
            })

    //hashing password
    const hashedPassword =await bcrypt.hash(password, 10)
   //creating a User
   const user= new User({
       name: name,
       email:email,
       password:hashedPassword
   })
   user.save().then(() => {
       //login

    return res.redirect('/')
   }).catch(err =>{
    req.flash('error', 'Something went wrong!!')
   
    return res.redirect('/register')
   })
            
        },
        logout(req, res){
            req.logout()
            return res.redirect('/login')
        }
    }
}
module.exports=authController