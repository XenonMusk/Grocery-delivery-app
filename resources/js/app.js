//client side
import axios from 'axios'
import Noty from 'noty'
import moment from 'moment'
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

//To render order status


let statuses =document.querySelectorAll('.status_line')
let hiddenInput = document.querySelector('#hiddenInput')
let order = hiddenInput ? hiddenInput.value : null
order = JSON.parse(order) 
let time =document.createElement('small')

function updateStatus(order){ 
    statuses.forEach((status) => {
        status.classList.remove('step-completed')
        status.classList.remove('current')

    })
    let stepCompleted =true;  //the first line will be gray
    statuses.forEach((status)=>{
        let dataProp =status.dataset.status
        if(stepCompleted){
            status.classList.add('step-completed')
        }
        if(dataProp === order.status){
            stepCompleted =false
            time.innerText =moment(order.updatedAt).format('hh:mm A')
            status.appendChild(time)
            if(status.nextElementSibling){

            
            status.nextElementSibling.classList.add('current')
        }
    }
    })

}
updateStatus(order);

/// Socket
let socket = io()

// Join
if(order) {
    socket.emit('join', `order_${order._id}`)
}
let adminAreaPath = window.location.pathname
if(adminAreaPath.includes('admin')) {
    initAdmin(socket)
    socket.emit('join', 'adminRoom')
}


socket.on('orderUpdated', (data) => {
    const updatedOrder = { ...order }
    updatedOrder.updatedAt = moment().format()
    updatedOrder.status = data.status
    updateStatus(updatedOrder)
    new Noty({
        type: 'success',
        timeout: 1000,
        text: 'Order updated',
        progressBar: false,
    }).show();
})