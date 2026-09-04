const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    product_id:{
        type:String,
        unique:true,
        trim:true,
        required:true
    },
    title:{
        type:String,
        trim:true,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    images:{
        type:String,
        required:true,
    },
    catagory:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category',
        required:true

    },
    checked:{
        type:Boolean,
        default:false
    },
    sold:{
        type:Number,
        default:0
    },
    quantity:{
        type:Number,
        default:0
    }
},{
    timestamps:true
})

module.exports = mongoose.model("Products",productSchema);