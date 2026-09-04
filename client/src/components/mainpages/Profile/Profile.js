import React from 'react'
import { GlobalState } from '../../../GlobalState'
import { useContext } from 'react'
import { Link, Navigate } from 'react-router-dom';

function Profile() {
    const state = useContext(GlobalState);
    const [isAdmin] = state.userAPI.isAdmin;
    const[isLogged] = state.userAPI.isLogged;

    if(!isLogged) return <Navigate to='/login' />

    const [currentUser,setCurrentUser] = state.userAPI.currentUser;
    console.log(currentUser);
    
  return (
     <div className='container'>
      <h1 className='heading'>Welcome, {currentUser.name}</h1>

      <div className='card' >
        <p><strong>Email:</strong> {currentUser.email}</p>
        <p><strong>Role:</strong> {isAdmin ? "Admin" : "user"}</p>
        <p><strong>Account Created:</strong> {new Date(currentUser.createdAt).toLocaleDateString()}</p>

        <Link to='/my-orders' className='.btn-order'>
          View Orders
        </Link>
      </div>
    </div>
  )
}

export default Profile