import React, { useEffect, useState, useContext } from 'react';
import { GlobalState } from '../../../GlobalState';
import { Navigate, useParams } from 'react-router-dom';
import axios from 'axios';
import configURL from '../../../configURL';

function EditProduct() {
  const params = useParams();
  const state = useContext(GlobalState);
  const [products] = state.productsAPI.products;
  const [catagoryName] = state.catagoryAPI.catagory;
  const [token] = state.token;
  const[isLogged,setIsLogged] = state.userAPI.isLogged
  const[isAdmin,setIsAdmin] = state.userAPI.isAdmin
  


  const [paramProduct, setParamProduct] = useState(null);
  const [update, setUpdate] = useState({
    product_id: '',
    title: '',
    description: '',
    catagory: '',
    price: '',
    content: '',
    images: '',
    quantity: ''
  });

  // Find the product based on params.id
  useEffect(() => {
    if (params && products.length > 0) {
      const foundProduct = products.find((prd) => prd._id === params.id);
      if (foundProduct) {
        setParamProduct(foundProduct);
      }
    }
  }, [params, products]);

  // Once paramProduct is set, update the update state
  useEffect(() => {
    if (paramProduct) {
      setUpdate({
        product_id: paramProduct.product_id || '',
        title: paramProduct.title || '',
        description: paramProduct.description || '',
        catagory: paramProduct.catagory || '',
        price: paramProduct.price || '',
        content: paramProduct.content || '',
        images: paramProduct.images || '',
        quantity: paramProduct.quantity || ''
      });
    }
  }, [paramProduct]);

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setUpdate({ ...update, [name]: value });
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    setUpdate({ ...update, images: file });
  };

  const UpdateProduct = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('product_id', update.product_id);
      formData.append('title', update.title);
      formData.append('description', update.description);
      formData.append('catagory', update.catagory);
      formData.append('price', update.price);
      formData.append('content', update.content);
      formData.append('images', update.images); // file
      formData.append('quantity', update.quantity);

      await axios.put(`${configURL}/api/products/${params.id}`, formData, {
        withCredentials: true,
        headers: { Authorization: token },
      });

      window.location.href = '/';
    } catch (err) {
      alert(err.response?.data?.msg || 'Product update failed');
    }
  };


    if(!isLogged){
    return (
      <Navigate to='/login' />
    )
  }

  if(!isAdmin && isLogged){
    return (
      <Navigate to='/' />
    )
  }

  return (
    <div className="create-product-container">
      <h2>Update Product</h2>
      <form onSubmit={UpdateProduct} encType="multipart/form-data" className="create-product-form">
        <input
          type="text"
          placeholder="Product id"
          name="product_id"
          onChange={onChangeInput}
          value={update.product_id}
          required
        />

        <input
          type="text"
          placeholder="Product Title"
          name="title"
          onChange={onChangeInput}
          value={update.title}
          required
        />
        <input
          type="text"
          placeholder="Product Description"
          name="description"
          onChange={onChangeInput}
          value={update.description}
          required
        />
        <label>Select Category</label>
        <select
          name="catagory"
          onChange={onChangeInput}
          value={update.catagory}
          required
        >
          <option value="">-- Select --</option>
          {catagoryName.map((ctgry) => (
            <option key={ctgry._id} value={ctgry._id}>
              {ctgry.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Product Price"
          name="price"
          onChange={onChangeInput}
          value={update.price}
          required
        />
        <input
          type="text"
          placeholder="Product Content"
          name="content"
          onChange={onChangeInput}
          value={update.content}
          required
        />
        <input
          type="file"
          name="images"
          onChange={handleUpload}
          accept="image/*"
        />
        <input
          type="number"
          name="quantity"
          placeholder="Enter quantity"
          onChange={onChangeInput}
          value={update.quantity}
          required
        />
        <input type="submit" value="Update Product" />
      </form>
    </div>
  );
}

export default EditProduct;
