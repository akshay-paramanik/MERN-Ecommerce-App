import React, { useContext } from 'react'
import { GlobalState } from '../../../GlobalState'
import { Link, Navigate } from 'react-router-dom';
import './orders.css';

function ViewOrders() {

  const state = useContext(GlobalState);
  const [isLogged] = state.userAPI.isLogged;
  const [orders] = state.userAPI.order;

if (!isLogged) return <Navigate to='/login' />;

return (
  <main className='orders-page'>
    <header className='orders-header'>
      <div>
        <p className='orders-eyebrow'>Account</p>
        <h1>My orders</h1>
        <p className='orders-subtitle'>Track your purchases and payment history.</p>
      </div>
      <Link className='orders-shop-link' to='/'>Continue shopping</Link>
    </header>

    <div className='orders-summary-bar'>
      <div><strong>{orders.length}</strong><span>Total orders</span></div>
      <div><strong>{orders.filter(order => order.status === 'Paid').length}</strong><span>Paid orders</span></div>
      <div><strong>₹{orders.reduce((total, order) => total + (order.total || 0), 0)}</strong><span>Total spent</span></div>
    </div>

    {orders.length > 0 ? (
      <section className='orders-list' aria-label='Order history'>
        {orders.map(order => (
          <article className='order-card' key={order._id}>
            <div className='order-card-header'>
              <div>
                <p className='order-label'>Order #{order._id.slice(-8).toUpperCase()}</p>
                <p className='order-date'>
                  {order.createdAt ? new Date(order.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric', month: 'short', day: 'numeric'
                  }) : 'Date unavailable'}
                </p>
              </div>
              <span className={`order-status order-status-${order.status.toLowerCase()}`}>
                {order.status}
              </span>
            </div>

            <div className='order-products'>
              {order.products.map((item, index) => (
                <div className='order-product' key={item.product?._id || index}>
                  <img src={item.product?.images} alt={item.product?.title || 'Product'} />
                  <div className='order-product-info'>
                    <h2>{item.product?.title || 'Product unavailable'}</h2>
                    <p>Product ID: {item.product?.product_id || 'N/A'}</p>
                    <span>₹{item.product?.price || 0} × {item.quantity}</span>
                  </div>
                  <strong>₹{(item.product?.price || 0) * item.quantity}</strong>
                </div>
              ))}
            </div>

            <footer className='order-card-footer'>
              <div>
                <span>Payment</span>
                <strong>{order.paymentId || 'Unavailable'}</strong>
              </div>
              <div className='order-total'>
                <span>Order total</span>
                <strong>₹{order.total}</strong>
              </div>
            </footer>
          </article>
        ))}
      </section>
    ) : (
      <section className='orders-empty'>
        <div className='orders-empty-icon'>○</div>
        <h2>No orders yet</h2>
        <p>Your completed purchases will appear here.</p>
        <Link className='orders-shop-link' to='/'>Explore products</Link>
      </section>
    )}
  </main>
);


}

export default ViewOrders