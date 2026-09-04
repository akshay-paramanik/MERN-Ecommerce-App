const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users",
        required:true
    },
    products:[
        {
            product:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Products",
                required:true
            },
            quantity:{
                type:Number,
                default:1
            }
        }
    ],
    total:{
        type:Number,
        required:true
    },
    paymentId:String,
    razorpayOrderId:String,
    status:{
        type:String,
        enum:["Pending","Paid","Cancelled"],
        default:"Paid"
    }
},{
    timestamps:true
});

module.exports = mongoose.model("Orders",orderSchema);