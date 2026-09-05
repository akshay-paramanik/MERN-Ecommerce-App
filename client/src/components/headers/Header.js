import React from 'react'
import {Link, useNavigate} from 'react-router-dom'
import { MdMenu } from "react-icons/md";
import { MdClose } from 'react-icons/md';
import { MdShoppingCart } from "react-icons/md";
import { GlobalState } from '../../GlobalState';
import { useContext } from 'react';
import axios from 'axios';
import configURL from '../../configURL';


function Header() {
    const navigate = useNavigate();


    const state = useContext(GlobalState)
    const [currentUser,setCurrentUser] = state.userAPI.currentUser;
    const[isLogged,setIsLogged] = state.userAPI.isLogged
    const[isAdmin,setIsAdmin] = state.userAPI.isAdmin
    const [cart] = state.userAPI.cart

    const logoutUser = async()=>{
        await axios.get(`${configURL}/user/logout`)
        localStorage.clear()
        setIsAdmin(false)
        setIsLogged(false)
        window.location.reload();

    }
    
    const adminRouter = ()=>{
        return(
            <>
            <li><Link to='./create_product'>Create Product</Link></li>
            <li><Link to='./catagory'>Catagories</Link></li>
            <li><Link to='./users'>Users</Link></li>
            </>
        )
    }

      const loggedRouter = ()=>{
        return(
            <>
            {!isAdmin ? <li><Link to={`/orders/${currentUser._id}`}>Orders</Link></li>:''}
            <li><Link to='/profile'>Profile</Link></li>
            <li><Link onClick={logoutUser}>Logout</Link></li>
            </>
        )
    }

  return (
    <header>
    <div className='menu'>
        <MdMenu size={30}/>
        
    </div>
    <div className='logo'>
        <h1>
            <Link to='/'>{isAdmin?'Admin':"Akshay's Shop"}</Link>
        </h1>
    </div>
    <ul>
        <li><Link to='/'>{!isAdmin && 'Products'}</Link></li>

        {isAdmin && adminRouter()}
        {
            isLogged ? loggedRouter() : <li><Link to='/login'>Login or Register</Link></li>
        }


        <li>
            <MdClose size={30} className='menu'/>
        </li>
    </ul>
    {
        isAdmin ? '' : <div className='cart-icon'>
        <span>{cart.length}</span>
        <Link to='/cart'><MdShoppingCart size={30}/></Link>
    </div>
    }
    

    </header>
  )
}

export default Header
