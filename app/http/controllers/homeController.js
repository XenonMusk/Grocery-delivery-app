const Menu=require('../../models/menu')
function homeController(){
    return {
        async index(req,res){
          // Menu.find().then(function(grocery){
          //   console.log(grocery)
          //   return res.render('home',{grocery: grocery})
          // })
         
          const grocery = await Menu.find()
          console.log(grocery)
          return res.render('home',{grocery:grocery})
        }
    }
}
module.exports=homeController