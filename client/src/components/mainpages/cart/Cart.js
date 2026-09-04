import React, { useContext, useState, useMemo } from 'react';
import { GlobalState } from '../../../GlobalState';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import configURL from '../../../configURL';
import axios from 'axios';
import loadRazorpay from '../../../utils/loadRazorpay';

function Cart() {
  const state = useContext(GlobalState);
  const [cart] = state.userAPI.cart;
  const checkoutOrder = state.userAPI.checkoutOrder;
  const removeFromCart = state.userAPI.removeFromCart;
  const [isLogged] = state.userAPI.isLogged;
  const [isAdmin] = state.userAPI.isAdmin;
  const [products] = state.productsAPI.products;
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);

  const cartProducts = useMemo(() => cart.map(item => {
    const productId = item.product?._id || item.product;
    const product = products.find(item => item._id.toString() === productId.toString());
    return product ? { ...product, quantity: item.quantity, cartProductId: productId } : null;
  }).filter(Boolean), [cart, products]);

  const amount = useMemo(
    () => cartProducts.reduce((total, item) => total + item.price * item.quantity, 0),
    [cartProducts]
  );

  const orderItems = useMemo(
    () => cart.map(item => ({
      productId: item.product?._id || item.product,
      quantity: item.quantity || 1
    })),
    [cart]
  );

  if (!isLogged) {
    return (
      <>
        <h1 style={{ textAlign: 'center' }}>Start your shop first</h1>
        <Link to='/login' style={{ textAlign: 'center', fontSize: '1.5rem' }}>Login</Link>
      </>
    );
  }

  if (cart.length === 0) {
    return (
      <>
        <h2 style={{ textAlign: "center", fontSize: "3rem" }}>Cart is Empty</h2>
        <Link style={{ textAlign: "center", fontSize: "2rem" }} to='/'>Shop Now</Link>
      </>
    );
  }

  const handlePayment = async () => {
    if (isProcessing || amount <= 0 || cartProducts.length !== cart.length) return;

    setIsProcessing(true);
    try {
      await loadRazorpay();
      const res = await axios.post(`${configURL}/api/payment/create-order`, { amount });

      const options = {
        key: res.data.key,
        amount: res.data.amount,
        currency: res.data.currency,
        name: "Strong Spark",
        description: "Order payment",
        order_id: res.data.orderId,
        handler: async function (response) {
          try {
            await checkoutOrder(
              orderItems,
              response.razorpay_payment_id,
              response.razorpay_order_id
            );
            alert("Payment successful and order placed.");
            navigate('/');
            navigate('/my-orders');
          } catch (error) {
            alert(error.message);
          } finally {
            setIsProcessing(false);
          }
        },
        theme: { color: "#2C6EE0" },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', () => {
        setIsProcessing(false);
        alert("Payment failed. Your order was not placed.");
      });
      rzp.on('modal.closed', () => setIsProcessing(false));
      rzp.open();
    } catch (error) {
      setIsProcessing(false);
      alert(error.response?.data?.message || error.message || "Payment failed");
      console.error(error);
    }
  };

  if(isAdmin){
    return (
      <Navigate to='/'/>
    )
  }

  return (
    <div>
      {cartProducts.map(prd => (
        <div key={prd.cartProductId} className='detail'>
          <div className='product_detail_img'>
            <img src={prd.images} alt='' />
          </div>
          <div className='box_detail'>
            <div className='row'>
              <h2>{prd.title}</h2>
              <h6>{prd.product_id}</h6>
            </div>
            <span>${prd.price}</span>
            <p>{prd.description}</p>
            <p>{prd.content}</p>
            <p>Sold: {prd.sold}</p>
            <button className='cart' onClick={() => removeFromCart(prd.cartProductId)}>Remove</button>
          </div>
        </div>
      ))}

     <div className="order-summary">
  <h3 className="total-amount">Total: ₹{amount}</h3>
  <button className="place-order-btn" onClick={handlePayment} disabled={isProcessing}>
    {isProcessing ? 'Processing...' : 'Pay and place order'}
  </button>
</div>

    </div>
  );
}

export default Cart;
