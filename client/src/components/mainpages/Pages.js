import React from 'react'
import Products from './Products/Products'
import Login from './Login/Login'
import Register from './Login/Register'
import Cart from './cart/Cart'
import {Route, Routes} from 'react-router-dom'
import DetailProduct from './utils/DetailProducts/DetailProduct'
import CreateProduct from './CURD Admin/CreateProduct'
import ViewCatagory from './CURD Admin/ViewCatagory'
import EditProduct from './CURD Admin/EditProduct'
import Users from './UsersView/Users'
import ViewOrders from './Orders/ViewOrders'
import Profile from './Profile/Profile'

function Pages() {
  return (
      <Routes>
        <Route path='/' element={<Products/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/my-orders' element={<ViewOrders/>} />
        <Route path='/details/:id' element={<DetailProduct/>} />
        <Route path='/create_product' element={<CreateProduct/>} />
        <Route path='/catagory' element={<ViewCatagory/>} />
        <Route path='/edit/:id' element={<EditProduct/>} />
        <Route path='/users' element={<Users/>} />
        <Route path='/orders/:id' element={<ViewOrders/>} />
        <Route path='/profile' element={<Profile/>} />


      </Routes>
  )
}

export default Pages