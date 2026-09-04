import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { GlobalState } from '../../../../GlobalState'
import axios from 'axios';
import configURL from '../../../../configURL';
import ProductList from '../ProductList/ProductList';

function DetailProduct() {
    const params = useParams()
    const state = useContext(GlobalState)
    const [products] = state.productsAPI.products
    const addCart = state.userAPI.addCart
    const [detailProduct,setDetailProduct] = useState(null)
    const [recommendations, setRecommendations] = useState([])
    const [showCartModal, setShowCartModal] = useState(false)

    useEffect(()=>{
        const product = products.find(item => item._id === params.id);
        setDetailProduct(product || null);
    },[params,products])
    console.log(detailProduct);

    useEffect(() => {
        if (!detailProduct?.product_id) return;

        const getRecommendations = async () => {
            try {
                const res = await axios.get(
                    `${configURL}/api/recommend/${encodeURIComponent(detailProduct.product_id)}`
                );
                setRecommendations(res.data);
            } catch (error) {
                setRecommendations([]);
                console.error('Unable to load recommendations', error);
            }
        };

        getRecommendations();
    }, [detailProduct]);

    const addToCart = async (prd)=>{
            const added = await addCart(prd)
            if (added) setShowCartModal(true)
    }

    if(!detailProduct) return null;
    
    return (
        <>
            <div className='detail'>
                    <div className='product_detail_img'>
                            <img src={detailProduct.images} alt={detailProduct.title} />
                    </div>
                    <div className='box_detail'>
                            <div className='row'>
                                    <h2>{detailProduct.title}</h2>
                                    <h6>{detailProduct.product_id}</h6>
                            </div>
                            <span>₹{detailProduct.price}</span>
                            <p>{detailProduct.description}</p>
                            <p>{detailProduct.content}</p>
                            <p>Sold: {detailProduct.sold}</p>
                            <button onClick={()=> addToCart(detailProduct) } className='cart'>Add to Cart</button>
            </div>
            </div>

            {recommendations.length > 0 && (
                <section className='products'>
                    <h2>Recommended products</h2>
                    {recommendations.map(product => (
                        <ProductList key={product._id} product={product} />
                    ))}
                </section>
            )}

            {showCartModal && (
                <div className='cart-modal-overlay' onClick={() => setShowCartModal(false)}>
                    <div
                        className='cart-modal'
                        role='dialog'
                        aria-modal='true'
                        aria-labelledby='cart-modal-title'
                        onClick={(event) => event.stopPropagation()}
                    >
                        <button
                            type='button'
                            className='cart-modal-close'
                            aria-label='Close'
                            onClick={() => setShowCartModal(false)}
                        >
                            ×
                        </button>
                        <div className='cart-modal-check'>✓</div>
                        <h2 id='cart-modal-title'>Added to cart successfully</h2>
                        <p>{detailProduct.title} has been added to your cart.</p>
                        <button
                            type='button'
                            className='cart-modal-button'
                            onClick={() => setShowCartModal(false)}
                        >
                            Continue shopping
                        </button>
                    </div>
                </div>
            )}
        </>
  )
}

export default DetailProduct