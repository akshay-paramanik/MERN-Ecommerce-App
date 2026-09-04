require('dotenv').config();
const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || process.env.ACCESS_TOKEN;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || process.env.REFRESH_TOKEN;

const userController = {
    register: async (req,res)=>{
        try{
            const {name,email,password} = req.body;

            const user = await userModel.findOne({email});
            if(user)
                return res.status(400).json({msg:"email already registerd!"})
            if(password.length < 6)
             return res.status(400).json({msg:"password must be needed more then 6 characters"})
            
            const passwordHash = await bcrypt.hash(password,10);
            const newUser = await userModel.create({
                name,
                email,
                password:passwordHash
            })
            const accesstoken = createAccessToken({id:newUser._id})
            const refreshtoken = createRefreshToken({id:newUser._id})

            res.cookie("refreshtoken", refreshtoken, {
                httpOnly: true,
                  path: "/user/refresh_token",
                  sameSite: "None",       // ✅ Required for cross-origin
                  secure: true            // ✅ Required on HTTPS (Render uses HTTPS)
                });


            res.json({msg:accesstoken})

        }catch(err){
            return res.status(500).json({msg:err.message});
        }
    },
    refreshtoken: async (req,res)=>{
        try{

            const rf_token = await req.cookies.refreshtoken
    
            if(!rf_token) return res.status(400).json({msg:"Login or Register First"})

            jwt.verify(rf_token,refreshTokenSecret,(err,user)=>{
            if(err) return res.status(400).json({msg:"Login or register first"})
            const accesstoken = createAccessToken({id:user.id})
            // res.json({user,accesstoken})
            res.json({user,accesstoken})
            })
        }catch(err){
            return res.status(500).json({mrg:err.message});
            
        }
    },
    login: async (req,res)=>{
        try{
            const {email,password} = req.body;

            const user = await userModel.findOne({email});
            if(!user) return res.status(400).json({msg:"User not found"})
            const isMatch = await bcrypt.compare(password,user.password);
            if(!isMatch) return res.status(400).json({msg:"Incorrect Password"})
                const accesstoken = createAccessToken({id:user._id})
            const refreshtoken = createRefreshToken({id:user._id})

           res.cookie("refreshtoken", refreshtoken, {
  httpOnly: true,
  path: "/user/refresh_token",
  sameSite: "None",
  secure: true
});

            
            res.json({accesstoken});


        }catch(err){
            return res.status(500).json({msg:err.message});
        }
    },
    logout: async (req,res)=>{
        try{
            res.clearCookie('refreshtoken',{
                path:'user/refresh_token'
            })
            return res.json({msg:"logout"})

        }catch(err){
            return res.status(500).json({msg:err.message});
        }
    },
    getUser: async (req,res)=>{
        try{
            const user = await userModel.findOne({_id:req.user.id}).select(`-password`);

            if(!user) return res.status(400).json({msg:"user not found"});

            res.json(user)
        }catch(err){
            return res.status(500).json({msg:err.message});
        }
    },
    addToCart: async(req,res)=>{
        try{
            const user = await userModel.findById(req.user.id);
            if(!user) return res.status(400).json({msg:"User does not exist"});


            const productToAdd = req.body.product;
            const productId = productToAdd?._id || productToAdd?.product || productToAdd;
            if(!productId) return res.status(400).json({msg:"No product Provided"});

            // check with existing product
            const existingProductCheck = user.cart.findIndex(
                item => item.product.toString() === productId.toString()
            );
            if(existingProductCheck >= 0){
                user.cart[existingProductCheck].quantity += 1;
            }else{
                user.cart.push({product: productId, quantity: 1});
            }

            await user.save();
             return res.json({ msg: "Cart updated.", cart: user.cart });



        }catch(err){
            return res.status(500).json({msg:err.message});
        }
    },
    removeCart: async (req,res)=>{
        try{
            const user = await userModel.findById(req.user.id);
            if(!user) return res.status(400).json({msg:"User does not exist"});

            user.cart = req.body.cart;
            await user.save();
            return res.json({msg:"removed"});
        }catch(err){
            return res.status(500).json({msg:err.message});
        }
    },
    viewUser: async (req,res) =>{
        try{
            const user = await userModel.find().select(`-password`);
            if(!user) return res.status(400).json({msg:"cant find any user"});
            res.json(user);
        }catch(err){
            return res.status(500).json({msg:err.message});

        }
    },
    deleteUser: async(req,res)=>{
        try{
             await userModel.findByIdAndDelete(req.params.id);
            res.json({msg:"user deleted"})
        }catch(err){
            return res.status(500).json({msg:err.message});
        }
},
addOrder: async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);
    if (!user) return res.status(400).json({ msg: "User not found" });

    const { cart, address, totalAmount } = req.body;

    if (!cart || cart.length === 0) {
      return res.status(400).json({ msg: "No cart items provided" });
    }

    const order = {
      items: cart,
      address: address,
      totalAmount: totalAmount,
      createdAt: new Date(),
      status: "Pending"
    };

    user.order.push(order); // Assuming user.order is an array of orders
    await user.save();

    return res.json({ msg: "Order placed successfully" });

  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
},
updateStatus: async(req,res)=>{
try {
    const user = await userModel.findById(req.params.id);
    if (!user) return res.status(400).json({ msg: "User not found" });

    const { statusChange, orderIndex } = req.body;

    if (
      orderIndex < 0 ||
      orderIndex >= user.order.length
    ) return res.status(400).json({ msg: "Invalid order index" });

    user.order[orderIndex].status = statusChange;

    await user.save();
    res.json({ msg: "Status updated successfully" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
},
viewOrder: async (req, res) => {
    try {
        const user = await userModel.findById(req.params.id)
        if(!user) return res.status(400).json({msg:"user not found"});
        const order = user.order;
        res.json(order);
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
}


}
const createAccessToken = (payload)=>{
    return jwt.sign(payload,accessTokenSecret,{expiresIn:'1d'});
}
const createRefreshToken = (payload)=>{
    return jwt.sign(payload,refreshTokenSecret,{expiresIn:'7d'});
}

module.exports = userController;
