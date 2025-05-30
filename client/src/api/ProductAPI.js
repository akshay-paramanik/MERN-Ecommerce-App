import React, { useEffect, useState } from 'react'
import configURL from '../configURL';
import axios from 'axios'

const ProductAPI = () => {

    const [products,setProducts]=useState([])

    const getProducts = async()=> {
        const res = await axios.get(`${configURL}/api/products`)
        setProducts(res.data.products)
    }

    useEffect(()=> {
        getProducts()
    },[])

  return {
    products : [products,setProducts]
  }
}

export default ProductAPI
