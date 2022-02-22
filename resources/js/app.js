//client side
import axios from 'axios'
import Noty from 'noty'
import {initAdmin} from './admin'
let addToCart =document.querySelectorAll('.add-to-cart')
let cartCounter=document.querySelector('#cartCounter')

function updateCart(grocery){
  axios.post('/update-cart', grocery).then(res =>{
      console.log(res)
      cartCounter.innerText= res.data.totalQty
      new Noty({
          type: 'success',
          timeout: 1000,
          text:'1 item added to cart',
          layout:'topLeft'
      }).show();
  }).catch(err => {
    new Noty({
        type: 'error',
        timeout: 1000,
        text: 'Something went wrong',
        progressBar: false,
    }).show();
})
}
addToCart.forEach((btn)=>{
    btn.addEventListener('click',(e)=>{
        let grocery = JSON.parse(btn.dataset.grocery)
      updateCart(grocery)
    })
})
//removing alert message after n seconds
const alertMsg =document.querySelector('#success-alert')
if(alertMsg){
    setTimeout(()=> {
        alertMsg.remove()
    },1700)
}
initAdmin()