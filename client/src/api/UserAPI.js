import React, { useEffect, useState } from 'react';
import axios from 'axios';
import configURL from '../configURL';

const UserAPI = (token) => {
    const [isLogged, setIsLogged] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [cart, setCart] = useState([]);
    const [users,setUsers] = useState([]);
    const [order,setOrder] = useState([]);
    const [currentUser,setCurrentUser] = useState([]);

    const getErrorMessage = (err, fallback) =>
        err.response?.data?.message || err.response?.data?.msg || fallback;

    useEffect(() => {
        if (token) {
            const getUser = async () => {
                try {
                    const res = await axios.get(`${configURL}/user/infor`, {
                        headers: { Authorization: token }
                    });

                    setIsLogged(true);
                    res.data.role === 1 ? setIsAdmin(true) : setIsAdmin(false);

                    setCart(res.data.cart)
                
                    setCurrentUser(res.data);
                    

                    if(res.data.role === 1){
                        findUser();
                    }

                } catch (err) {
                    alert(err.response.data.msg);
                }
            };
            getUser();

            axios.get(`${configURL}/order/my-orders`, {
                headers: { Authorization: token }
            }).then(res => {
                setOrder(res.data);
            }).catch(err => {
                console.error(getErrorMessage(err, 'Unable to load orders'));
            });

        }
    }, [token]);


    

    const addCart = async (product) => {
    if (!isLogged) return alert("Please log in first.");

    try {
        const res = await axios.patch(`${configURL}/user/addcart`,
            { product: product._id },
            { headers: { Authorization: token } }
        );

        // ✅ Update local cart with the latest one from the server
        setCart(res.data.cart);
        return true;

    } catch (err) {
        alert(getErrorMessage(err, 'Unable to update cart'));
        return false;
    }
};

const findUser = async ()=>{
    try{
        const res = await axios.get(`${configURL}/user/viewusers`,{
            headers:{Authorization: token}
        })
        setUsers(res.data);
        console.log(res.data);
        
        
    }catch(err){
        alert("users nhi mil rha hai");
    }
}




const checkoutOrder = async (cartItems, paymentId, razorpayOrderId)=>{
    if (!isLogged) throw new Error("Please log in first.");
    try{
        const res = await axios.post(`${configURL}/order/checkout`, {
            cartItems,
            paymentId,
            razorpayOrderId
        }, {
            headers: { Authorization: token }
        });

        await axios.patch(`${configURL}/user/remove_cart`, { cart: [] }, {
            headers: { Authorization: token }
        });
        setCart([]);
        return res.data;
        
    }catch(err){
        throw new Error(getErrorMessage(err, 'Unable to place order'));
    }
}

const removeFromCart = async (id)=>{
    const updatedCart = cart.filter(item => {
        const productId = item.product?._id || item.product;
        return productId.toString() !== id.toString();
    });
    setCart(updatedCart);

    try {
        await axios.patch(`${configURL}/user/remove_cart`, { cart: updatedCart }, {
            headers:{Authorization:token}
        });
    } catch (err) {
        setCart(cart);
        alert(getErrorMessage(err, 'Unable to update cart'));
    }

}




    return {
        isLogged: [isLogged, setIsLogged],
        isAdmin: [isAdmin, setIsAdmin],
        cart:[cart,setCart],
        addCart: addCart,
        checkoutOrder: checkoutOrder,
        order:[order,setOrder],
        users:[users,setUsers],
        removeFromCart : removeFromCart,
        currentUser: [currentUser,setCurrentUser]
    };
};

export default UserAPI;
