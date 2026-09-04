import React from 'react'
import { Link } from 'react-router-dom'
import { GlobalState } from '../../../../GlobalState'
import { useContext } from 'react'
import axios from 'axios'
import configURL from '../../../../configURL';

function BtnRender({product}) {

    const state = useContext(GlobalState)
        const [isAdmin] = state.userAPI.isAdmin
        const products = state.productsAPI.products
        const [token] = state.token


    const deleteProduct = async (prd)=>{
      console.log(products);
      try{
        await axios.delete(`${configURL}/api/products/${prd._id}`,{
          withCredentials:true,
          headers:{Authorization:token}
        })
        window.location.reload(); 
        alert("deleted");


      }catch(err){
        console.error(err);
        
      }
      
    }
  return (
            <div className='raw_btn'>
          {
            isAdmin ? 
            <>
            <button id='btn_delete' onClick={()=> deleteProduct(product)}>Delete</button>
          <Link id='btn_view' to={`edit/${product._id}`} >
          edit
          </Link>
          </>
           :
           <>
          <Link id='btn_view' to={`details/${product._id}`} >
          View Now
          </Link>
          </>
          }
        </div>
  )
}

export default BtnRender

