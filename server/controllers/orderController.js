const Order = require("../models/orderModel");
const Product = require("../models/productModel");

const orderController = {

    checkoutCart: async(req,res)=>{

        try{

            const {
                cartItems,
                paymentId,
                razorpayOrderId
            } = req.body;

            const userId = req.user.id;

            if(!cartItems || cartItems.length===0){

                return res.status(400).json({
                    success:false,
                    message:"Cart is empty"
                });

            }

            let total = 0;
            const orderItems = [];

            for(const item of cartItems){

                const product = await Product.findById(item.productId);

                if(!product){

                    return res.status(404).json({
                        success:false,
                        message:"Product not found"
                    });

                }

                if(product.quantity < item.quantity){

                    return res.status(400).json({
                        success:false,
                        message:`${product.title} is out of stock`
                    });

                }

                total += product.price * item.quantity;

                product.quantity -= item.quantity;
                product.sold += item.quantity;

                await product.save();

                orderItems.push({
                    product:product._id,
                    quantity:item.quantity
                });

            }

            const order = await Order.create({

                user:userId,
                products:orderItems,
                total,
                paymentId,
                razorpayOrderId,
                status:"Paid"

            });

            res.status(201).json({

                success:true,
                message:"Order placed successfully",
                order

            });

        }catch(err){

            res.status(500).json({
                success:false,
                message:err.message
            });

        }

    },

    getMyOrders: async(req,res)=>{

        const orders = await Order.find({
            user:req.user.id
        })
        .populate("products.product","title price images product_id")
        .sort({createdAt:-1});

        res.json(orders);

    }

};

module.exports = orderController;