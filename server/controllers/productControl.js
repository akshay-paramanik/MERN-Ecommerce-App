const productModel = require('../models/productModel');
const catagoryModel = require('../models/catagoryModel');
const mongoose = require('mongoose');
const APIfeatures = require('../utils/APIfeature');
const RecommendationRule = require("../models/recommendationRuleModel");

const productControl = {
    getProduct: async (req,res)=>{
        try{
            const features = new APIfeatures(productModel.find(), req.query)
            .filtering()
            .sorting()
            .paginating();

            const products = await features.query;
            res.json({status:'success',
                result: products.length,
            products:products})
        }catch(err){
            res.status(500).json({msg:err.message});
        }
    },
    createProduct: async (req, res) => {
        try {
            const { product_id, title, price, description, content, catagory, quantity } = req.body;

            if (!mongoose.isValidObjectId(catagory)) {
                return res.status(400).json({ msg: "Please select a valid category" });
            }

            const categoryExists = await catagoryModel.exists({ _id: catagory });
            if (!categoryExists) {
                return res.status(400).json({ msg: "Selected category does not exist" });
            }
    
            if (!req.file) return res.status(400).json({ msg: "No Image Uploaded" });
    
            const product = await productModel.findOne({ product_id });
    
            if (product) return res.status(400).json({ msg: "This product already exists" });

            const imageUrl = req.file.path; // ✅ This should be a full URL
    
            const newProduct = new productModel({
                product_id,
                title: title.toLowerCase(),
                price: Number(price),
                description,
                content,
                images: imageUrl,  // Store image path
                catagory,
                quantity
            });
    
            await newProduct.save();
            res.json({ msg: "Product created" });
    
        } catch (err) {
            res.status(500).json({ msg: err.message });
        }
    },
    
    deleteProduct: async (req,res)=>{
        try{
            await productModel.findByIdAndDelete(req.params.id);
            res.json({msg:"product deleted"});
        }catch(err){
            res.status(500).json({msg:err.message});
        }
    },
    updateProduct: async (req,res)=>{
        try{
            const { product_id, title, price, description, content, catagory, quantity } = req.body;

            if (!mongoose.isValidObjectId(catagory)) {
                return res.status(400).json({ msg: "Please select a valid category" });
            }

            const categoryExists = await catagoryModel.exists({ _id: catagory });
            if (!categoryExists) {
                return res.status(400).json({ msg: "Selected category does not exist" });
            }
    
            if (!req.file) return res.status(400).json({ msg: "No Image Uploaded" });
            const imageUrl = req.file.path;

            await productModel.findByIdAndUpdate({_id:req.params.id},{
                product_id,
                title: title.toLowerCase(),
                price,
                description,
                content,
                images: imageUrl,  // Store image path
                catagory
            })
            res.json({msg:"product updated"});

        }catch(err){
            res.status(500).json({msg:err.message});
        }
    },
    getRecommendations : async (req,res)=>{

        try {

        const { productId } = req.params;

        const currentProduct = await productModel.findOne({
            product_id: productId
        });

        if (!currentProduct) {
            return res.status(404).json({
                msg: "Product not found"
            });
        }

        const rules = await RecommendationRule.find({
            lhs: productId
        })
        .sort({ confidence: -1 })
        .limit(5);

        const recommendedIds = [
            ...new Set(rules.flatMap(rule => rule.rhs))
        ];

        let products = [];

        if (recommendedIds.length) {

            products = await productModel.find({
                product_id: { $in: recommendedIds }
            });

        } else {

            products = await productModel.find({
                catagory: currentProduct.catagory,
                product_id: { $ne: productId }
            })
            .sort({ sold: -1 })
            .limit(5);
        }

        res.json(products);

    } catch (err) {
        res.status(500).json({
            msg: err.message
        });
    }
    }
}
module.exports=productControl