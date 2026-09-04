const razorpay = require('../config/razorpay');

const paymentController = {
    createOrder: async (req,res)=>{
        const {amount} = req.body;

        try{
            const order = await razorpay.orders.create({
                amount: amount * 100,
                currency: "INR",
                receipt: `receipt_order_${Date.now()}`
            });


            res.status(200).json({
                success:true,
                orderId: order.id,
                amount: order.amount,
                currency: order.currency,
                key: process.env.RAZORPAY_KEY_ID
            })


        }catch(err){
                console.error("Order Creation Error:", err);
                res.status(500).json({ success: false, message: "Payment initiation failed" });
        }
        }
}

module.exports = paymentController;