import React, { useContext, useState } from 'react';
import { GlobalState } from '../../../GlobalState';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import configURL from '../../../configURL';

function CreateProduct() {
  const state = useContext(GlobalState);
  const [isLogged] = state.userAPI.isLogged;
  const [isAdmin] = state.userAPI.isAdmin;
  const [catagoryName] = state.catagoryAPI.catagory;
  const [token] = state.token;

  const [product, setProduct] = useState({
    product_id: '',  
    title: '',
    description: '',
    catagory: '',
    price: '',
    content: '',
    images: '',
    quantity: ''
  });

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    setProduct({ ...product, images: file });
  };

  const CreateProduct = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      Object.entries(product).forEach(([key, value]) => {
        formData.append(key, value);
      });

      await axios.post(`${configURL}/api/products`, formData, {
        withCredentials: true,
        headers: { Authorization: token },
      });

      window.location.href = '/';
    } catch (err) {
      alert(err.response?.data?.msg || 'Product creation failed');
    }
  };

  if (!isLogged) return <Navigate to="/login" replace />;
  if (!isAdmin && isLogged) return <Navigate to="/" replace />;

  return (
    <div className="create-product-container">
      <h2>Create Product</h2>
      <form onSubmit={CreateProduct} className="create-product-form" encType="multipart/form-data">
        <input
          type='text'
          placeholder='Product ID'
          name='product_id'
          onChange={onChangeInput}
          value={product.product_id}
          required
        />

        <input
          type="text"
          placeholder="Product Title"
          name="title"
          onChange={onChangeInput}
          value={product.title}
          required
        />

        <input
          type="text"
          placeholder="Product Description"
          name="description"
          onChange={onChangeInput}
          value={product.description}
          required
        />

        <label>Select Category</label>
        <select
          name="catagory"
          onChange={onChangeInput}
          value={product.catagory}
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
          value={product.price}
          required
        />

        <input
          type="text"
          placeholder="Product Content"
          name="content"
          onChange={onChangeInput}
          value={product.content}
          required
        />

        <input
          type="file"
          name="images"
          onChange={handleUpload}
          accept="image/*"
          required
        />

        <input
          type="number"
          name="quantity"
          placeholder="Enter quantity"
          onChange={onChangeInput}
          value={product.quantity}
          required
        />

        <input type="submit" value="Create Product" />
      </form>
    </div>
  );
}

export default CreateProduct;
