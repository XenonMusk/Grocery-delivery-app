require('dotenv').config() //callling a method on the import
const express = require('express')
const app = express()
const ejs = require('ejs')
const path= require('path')
const expressLayout=require('express-Ejs-layouts')
const PORT = process.env. PORT || 3300
const mongoose= require('mongoose') //importing mongoose
const session = require('express-session')
const flash =require('express-flash')
const MongoDbStore = require('connect-mongo')

//Databse connection

// const url = 'mongodb://localhost:27017/grocery'; 
// mongoose.connect(url, { useNewUrlParser: true, useCreateIndex:true, useUnifiedTopology: true,
// useFindAndModify : true });
// const connection = mongoose.connection;
// connection.once('open', () => {
//      console. log('Database connected...');
// }).catch(err => {
//      console.log('Connection failed...')
// });
mongoose.connect("mongodb://localhost:27017/grocery", { useNewurlParser: true, useUnifiedTopology: true } )
.then( () => console.log("connection successfull...."))
.catch((err) => console.log(err)) ;


//session store
// let mongoStore = new MongoDbStore({
//     mongooseConnection: connection,
//     collection:'sessions'
// })


//Session Config
app.use(session({
    secret: process.env.COOKIE_SECRET ,  //getting the secret
    resave: false,
    store: MongoDbStore.create({mongoUrl:'mongodb://localhost:27017/grocery'}),
   saveUninitialized: false,
   cookie: { maxAge: 1000 * 60 * 60 * 24 } // Time in ms ==24 hrs

}))
app.use(flash())
// set Template engine
app.use(expressLayout)
app.set('views', path.join (__dirname, '/resources/views'))
app.set('view engine', 'ejs')

//Assets
// app.listen(express.static('public'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())


//Global Middleware

app.use((req,res,next)=>{
    res.locals.session=req.session
    next()
})





require('./routes/web')(app)



app.listen(PORT , () => {
    console.log(`Listening on port ${PORT}`)
})
